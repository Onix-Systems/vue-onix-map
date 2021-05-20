import api from '@/service/api';

export default {
  getEmployeesData() {
    return api.get(`/employee?fields=id,passportId,technologies&where={"isActive":true}`);
  },

  getEmployeesSkills() {
    return api.get(`/employeeskill?where={"status":"approved"}`);
  },

  getTechnologies() {
    return api.get(`/projecttechnology`);
  },

  getEmployeesOnVacation() {
    return api.get(`/employee/onvacation`);
  },

  getSkillsList() {
    return api.get(`/skill`);
  },
}