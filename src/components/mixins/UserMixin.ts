import {Component, Prop, Vue} from 'vue-property-decorator';
import {store} from '@/store';
import {UserInterface} from '@/interfaces/userInterface';
import {TechnologyInterface} from '@/interfaces/technologyInterface';
import {EmployeeInterface} from '@/interfaces/employeeInterface';
import {SkillInterface} from '@/interfaces/skillInterface';

@Component
export default class UserMixin extends Vue {
  @Prop({type: Object}) public user!: UserInterface;

  // public getUserEmployee(user: UserInterface): EmployeeInterface | undefined {
  //   return store.state.employees.find((employeeVal) => {
  //     return employeeVal.passportId === user.id;
  //   });
  // }

  // public getUserTechnologies(user: UserInterface): TechnologyInterface[] {
  //   const userTechnologies: TechnologyInterface[] = [];
  //   const employee = this.getUserEmployee(user);
  //
  //   if (!employee || !employee.hasOwnProperty('technologies')) {
  //     return userTechnologies;
  //   }
  //
  //   employee.technologies!.forEach((id) => {
  //     const technology = store.state.technologies.find((val) => {
  //       return val.id === id;
  //     });
  //     if (technology) {
  //       userTechnologies.push(technology);
  //     }
  //   });
  //
  //   return userTechnologies;
  // }

  // public isUserOnVacation(user: UserInterface): boolean {
  //   const vacation = store.state.employeesOnVacation.find((val) => {
  //     const employee = this.getUserEmployee(user);
  //
  //     if (employee) {
  //       return val === employee.id;
  //     }
  //   });
  //   return !!vacation;
  // }

  // public getUserSkills(user: UserInterface): SkillInterface[] {
  //   const userSkills: SkillInterface[] = [];
  //   const employee = this.getUserEmployee(user);
  //   if (!employee) {
  //     return userSkills;
  //   }
  //
  //   const employeeSkills = store.state.employeesSkills.filter((value) => {
  //     return value.employee === employee.id;
  //   });
  //
  //   employeeSkills.forEach((employeeSkillsValue) => {
  //     const skill = store.state.skillsList.find((skillVal) => {
  //       return skillVal.id === employeeSkillsValue.skill;
  //     });
  //     if (skill) {
  //       userSkills.push(skill);
  //     }
  //   });
  //
  //   return userSkills;
  // }

  public getUserRoles(user: UserInterface): string[] {
    const roles = user.groups.filter((group: string) => {
      if (group !== 'wiFi' && group !== 'employee' && group !== 'et') {
        return group;
      }
    });

    return roles.map((role: string) => {
      if (role.length <= 3) {
        return role.toUpperCase();
      }
      return this.convertCamelCaseToSentenceCase(role);
    });
  }

  public convertCamelCaseToSentenceCase(str: string): string {
    const result = str.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  get userTechnologies() {
    return this.user.technologies;
  }

  get checkUserOnVacation() {
    return this.user.isVacation;
  }

  get userRoles() {
    return [];
  }
}
