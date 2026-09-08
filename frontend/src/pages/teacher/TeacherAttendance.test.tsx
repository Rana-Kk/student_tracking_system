import {describe,it,expect,vi,beforeEach} from 'vitest'
import {render,screen} from '@testing-library/react'
import TeacherAttendance from './TeacherAttendance'
import * as api from '../../lib/api'
vi.mock('../../lib/api',async()=>{const a=await vi.importActual<any>('../../lib/api');return {...a,getMyGroups:vi.fn(),getPendingAttendanceAppeals:vi.fn(),getGroupStudents:vi.fn(),getGroupAttendanceSummary:vi.fn(),getAttendance:vi.fn(),saveAttendance:vi.fn(),reviewAttendanceAppeal:vi.fn()}})
describe('TeacherAttendance',()=>{beforeEach(()=>vi.clearAllMocks())
 it('shows loading while groups resolve',()=>{vi.mocked(api.getMyGroups).mockReturnValue(new Promise(()=>{}) as any);vi.mocked(api.getPendingAttendanceAppeals).mockResolvedValue({data:[]} as any);render(<TeacherAttendance/>);expect(screen.getByText(/Loading/i)).toBeInTheDocument()})
 it('shows an empty state when no groups are assigned',async()=>{vi.mocked(api.getMyGroups).mockResolvedValue({data:[]} as any);vi.mocked(api.getPendingAttendanceAppeals).mockResolvedValue({data:[]} as any);render(<TeacherAttendance/>);expect(await screen.findByText(/No groups/i)).toBeInTheDocument()})
})
