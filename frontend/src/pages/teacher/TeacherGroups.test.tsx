import { describe,it,expect,vi,beforeEach } from 'vitest'
import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TeacherGroups from './TeacherGroups'
import * as api from '../../lib/api'
vi.mock('../../lib/api',async()=>{const actual=await vi.importActual<any>('../../lib/api');return {...actual,getMyGroups:vi.fn(),getCourses:vi.fn(),createGroup:vi.fn(),getGroupStudents:vi.fn(),getUsers:vi.fn(),getTeams:vi.fn(),getAssessments:vi.fn()}})
describe('TeacherGroups',()=>{beforeEach(()=>vi.clearAllMocks())
 it('shows loading while groups resolve',()=>{vi.mocked(api.getMyGroups).mockReturnValue(new Promise(()=>{}) as any);render(<TeacherGroups/>);expect(screen.getByText('Loading…')).toBeInTheDocument()})
 it('shows empty state',async()=>{vi.mocked(api.getMyGroups).mockResolvedValue({data:[]} as any);render(<TeacherGroups/>);expect(await screen.findByText(/No groups/i)).toBeInTheDocument()})
 it('validates group creation form',async()=>{const user=userEvent.setup();vi.mocked(api.getMyGroups).mockResolvedValue({data:[]} as any);vi.mocked(api.getCourses).mockResolvedValue({data:[{id:1,name:'Full Stack'}]} as any);render(<TeacherGroups/>);await screen.findByText(/No groups/i);await user.click(screen.getByRole('button',{name:/Create Group/i}));await user.click(screen.getByRole('button',{name:'Create Group'}));expect(await screen.findByText('Group name is required')).toBeInTheDocument()})
})
