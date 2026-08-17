import { Router } from 'express'
import {
  listGroups,
  getGroup,
  createGroup,
  assignTeacher,
  addStudent,
  listGroupStudents,
} from '../controllers/groups.controller.js'
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router()

router.use(authenticate)

router.get('/', listGroups)
router.get('/:id', getGroup)
router.get('/:id/students', listGroupStudents)

router.post('/', authorize('admin'), createGroup)
router.post('/:id/teachers', authorize('admin'), assignTeacher)
router.post('/:id/students', authorize('admin'), addStudent)

export default router
