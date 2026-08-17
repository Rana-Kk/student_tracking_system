import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

// 1. Kullanıcının giriş yapıp yapmadığını (Token) kontrol eder
export const authenticate = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Bu işlem için giriş yapmalısınız (Token eksik)'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded; // Token'dan çıkan kullanıcı bilgilerini request'e ekle
    next();
  } catch (error) {
    return next(new ApiError(401, 'Geçersiz veya süresi dolmuş token'));
  }
};

// 2. Kullanıcının yetkisini (Rolünü) kontrol eder
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Erişim reddedildi: Bu işlem için yetkiniz bulunmuyor'));
    }
    next();
  };
};