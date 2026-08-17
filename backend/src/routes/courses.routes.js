import { Router } from 'express'
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courses.controller.js'
import { authenticate, authorize } from '../middleware/auth.js';
const router = Router()

router.use(authenticate) // every course route requires a logged-in user

router.get('/', listCourses)
router.get('/:id', getCourse)

// Only admins create/edit/delete courses (proposal §3: administrator manages courses)
router.post('/', authorize('admin'), createCourse)
router.put('/:id', authorize('admin'), updateCourse)
router.delete('/:id', authorize('admin'), deleteCourse)

export default router
