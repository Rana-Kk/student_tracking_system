import { describe,it,expect,vi,beforeEach } from 'vitest'
import { render,screen,waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TeacherReports from './TeacherReports'
import { getMyGroups,getGroupStudents,getStudentReport } from '../../lib/api'

vi.mock('../../lib/api',()=>({getMyGroups:vi.fn(),getGroupStudents:vi.fn(),getStudentReport:vi.fn()}))
vi.mock('jspdf',()=>({default: vi.fn().mockImplementation(()=>({save:vi.fn(),setFontSize:vi.fn(),text:vi.fn(),addPage:vi.fn()}))}))
const groups=vi.mocked(getMyGroups), students=vi.mocked(getGroupStudents), report=vi.mocked(getStudentReport)
describe('TeacherReports',()=>{beforeEach(()=>vi.resetAllMocks())
 it('shows loading while students resolve',()=>{groups.mockReturnValue(new Promise(()=>{}) as any);render(<TeacherReports/>);expect(screen.getByText('Loading...')).toBeInTheDocument()})
 it('shows empty state',async()=>{groups.mockResolvedValue({data:[]} as any);render(<TeacherReports/>);expect(await screen.findByText('You have no students yet.')).toBeInTheDocument()})
 it('deduplicates students from groups',async()=>{groups.mockResolvedValue({data:[{id:1},{id:2}]} as any);students.mockResolvedValue({data:[{id:5,name:'Rana'}]} as any);render(<TeacherReports/>);expect(await screen.findByRole('option',{name:'Rana'})).toBeInTheDocument();expect(students).toHaveBeenCalledTimes(2)})
 it('shows load error',async()=>{groups.mockRejectedValue(new Error('Groups unavailable'));render(<TeacherReports/>);expect(await screen.findByText('Groups unavailable')).toBeInTheDocument()})
})