import express from 'express';
import * as usersController from '../controllers/users.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Tüm rotalar için token doğrulama
router.use(authenticate);

// Öğrencinin kendi GitHub kullanıcı adını bağlaması
router.patch('/profile/github', usersController.updateMyGithubUsername);

// Kullanıcıları listeleme (Admin ve Öğretmen)
router.get('/', authorize('admin', 'teacher'), usersController.getUsers);

// Tekil kullanıcı detayı
router.get('/:id', usersController.getUserById);

// Admin yönetimsel işlemleri
router.post('/', authorize('admin'), usersController.createUser);
router.put('/:id', authorize('admin'), usersController.updateUser);
router.delete('/:id', authorize('admin'), usersController.deleteUser);

export default router;