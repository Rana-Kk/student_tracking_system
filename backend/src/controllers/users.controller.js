import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// 1. Kullanıcı Listesi
export const getUsers = asyncHandler(async (req, res) => {
  const { role, search, is_active } = req.query;
  let query = `
    SELECT id, name, email, role, github_username, is_active, created_at, updated_at
    FROM users
    WHERE 1=1
  `;
  const params = [];

  if (role) {
    query += ' AND role = ?';
    params.push(role);
  }

  if (is_active !== undefined) {
    query += ' AND is_active = ?';
    params.push(is_active === 'true' || is_active === '1');
  }

  if (search) {
    query += ' AND (name LIKE ? OR email LIKE ? OR github_username LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  query += ' ORDER BY created_at DESC';

  const [users] = await pool.query(query, params);

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// 2. Tekil Kullanıcı Getir
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [users] = await pool.query(
    `SELECT id, name, email, role, github_username, is_active, created_at, updated_at 
     FROM users WHERE id = ?`,
    [id]
  );

  if (users.length === 0) {
    throw new ApiError(404, 'Kullanıcı bulunamadı');
  }

  res.status(200).json({
    success: true,
    data: users[0]
  });
});

// 3. Yeni Kullanıcı Oluştur (Admin)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, github_username } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, 'İsim, e-posta, şifre ve rol alanları zorunludur');
  }

  if (!['admin', 'teacher', 'student'].includes(role)) {
    throw new ApiError(400, 'Geçersiz rol. Rol: admin, teacher veya student olmalıdır');
  }

  const [existingEmail] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existingEmail.length > 0) {
    throw new ApiError(409, 'Bu e-posta adresi zaten kayıtlı');
  }

  if (github_username) {
    const [existingGithub] = await pool.query('SELECT id FROM users WHERE github_username = ?', [github_username]);
    if (existingGithub.length > 0) {
      throw new ApiError(409, 'Bu GitHub kullanıcı adı başka bir kullanıcıya tanımlı');
    }
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, github_username) 
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, password_hash, role, github_username || null]
  );

  const [newUser] = await pool.query(
    `SELECT id, name, email, role, github_username, is_active, created_at 
     FROM users WHERE id = ?`,
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    message: 'Kullanıcı başarıyla oluşturuldu',
    data: newUser[0]
  });
});

// 4. Kullanıcı Güncelle (Admin)
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role, github_username, is_active, password } = req.body;

  const [existingUser] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
  if (existingUser.length === 0) {
    throw new ApiError(404, 'Güncellenecek kullanıcı bulunamadı');
  }

  if (email) {
    const [emailCheck] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
    if (emailCheck.length > 0) {
      throw new ApiError(409, 'Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor');
    }
  }

  if (github_username) {
    const [githubCheck] = await pool.query('SELECT id FROM users WHERE github_username = ? AND id != ?', [github_username, id]);
    if (githubCheck.length > 0) {
      throw new ApiError(409, 'Bu GitHub kullanıcı adı başka bir kullanıcıda kayıtlı');
    }
  }

  let updateQuery = 'UPDATE users SET ';
  const updateFields = [];
  const queryParams = [];

  if (name) { updateFields.push('name = ?'); queryParams.push(name); }
  if (email) { updateFields.push('email = ?'); queryParams.push(email); }
  if (role) { updateFields.push('role = ?'); queryParams.push(role); }
  if (github_username !== undefined) { updateFields.push('github_username = ?'); queryParams.push(github_username || null); }
  if (is_active !== undefined) { updateFields.push('is_active = ?'); queryParams.push(is_active); }
  
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    updateFields.push('password_hash = ?');
    queryParams.push(password_hash);
  }

  if (updateFields.length === 0) {
    throw new ApiError(400, 'Güncellenecek alan belirtilmedi');
  }

  updateQuery += updateFields.join(', ') + ' WHERE id = ?';
  queryParams.push(id);

  await pool.query(updateQuery, queryParams);

  const [updatedUser] = await pool.query(
    `SELECT id, name, email, role, github_username, is_active, updated_at 
     FROM users WHERE id = ?`,
    [id]
  );

  res.status(200).json({
    success: true,
    message: 'Kullanıcı başarıyla güncellendi',
    data: updatedUser[0]
  });
});

// 5. Öğrencinin GitHub Kullanıcı Adını Güncellemesi
export const updateMyGithubUsername = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { github_username } = req.body;

  if (!github_username || typeof github_username !== 'string') {
    throw new ApiError(400, 'Geçerli bir GitHub kullanıcı adı giriniz');
  }

  const cleanUsername = github_username.trim().replace(/^@/, '');

  const [existing] = await pool.query(
    'SELECT id FROM users WHERE github_username = ? AND id != ?',
    [cleanUsername, userId]
  );

  if (existing.length > 0) {
    throw new ApiError(409, 'Bu GitHub kullanıcı adı başka bir kullanıcı tarafından kayıt edilmiş');
  }

  await pool.query(
    'UPDATE users SET github_username = ? WHERE id = ?',
    [cleanUsername, userId]
  );

  res.status(200).json({
    success: true,
    message: 'GitHub kullanıcı adı başarıyla kaydedildi.',
    data: {
      user_id: userId,
      github_username: cleanUsername
    }
  });
});

// 6. Kullanıcı Sil (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
  if (user.length === 0) {
    throw new ApiError(404, 'Kullanıcı bulunamadı');
  }

  await pool.query('DELETE FROM users WHERE id = ?', [id]);

  res.status(200).json({
    success: true,
    message: 'Kullanıcı başarıyla silindi'
  });
});