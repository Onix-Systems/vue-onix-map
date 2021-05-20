import {Component, Prop, Vue} from 'vue-property-decorator';
import {vxm} from '@/store';
import {UserInterface} from '@/interfaces/userInterface';
import {TechnologyInterface} from '@/interfaces/technologyInterface';
import {EmployeeInterface} from '@/interfaces/employeeInterface';
import {SkillInterface} from '@/interfaces/skillInterface';
import {EmployeeSkillInterface} from '@/interfaces/employeeSkillInterface';
import {UserExperienceEnum} from '@/enums/UserExperienceEnum';

@Component
export default class UserMixin extends Vue {
  @Prop({type: Object}) public user!: UserInterface;

  public getUserEmployee(user: UserInterface): EmployeeInterface | undefined {
    return vxm.general.employees.find((employeeVal: EmployeeInterface) => {
      return employeeVal.passportId === user.id;
    });
  }

  public getUserTechnologies(user: UserInterface): TechnologyInterface[] {
    const userTechnologies: TechnologyInterface[] = [];
    const employee = this.getUserEmployee(user);

    if (!employee || !employee.hasOwnProperty('technologies')) {
      return userTechnologies;
    }

    employee.technologies!.forEach((id) => {
      const technology = vxm.general.technologies.find((val: TechnologyInterface) => {
        return val.id === id;
      });
      if (technology) {
        userTechnologies.push(technology);
      }
    });

    return userTechnologies;
  }

  public isUserOnVacation(user: UserInterface): boolean {
    const vacation = vxm.general.employeesOnVacation.find((val: string) => {
      const employee = this.getUserEmployee(user);

      if (employee) {
        return val === employee.id;
      }
    });
    return !!vacation;
  }

  public getEmployeeSkills(user: UserInterface): EmployeeSkillInterface[] {
    if (process.env.VUE_APP_DEMO_MODE) {
      return [];
    }
    const employee = this.getUserEmployee(user);
    if (!employee) {
      return [];
    }
    return vxm.general.employeesSkills.filter((value: EmployeeSkillInterface) => {
      return value.employee === employee.id;
    });
  }

  public getUserSkills(user: UserInterface): SkillInterface[] {
    const userSkills: SkillInterface[] = [];
    const employeeSkills = this.getEmployeeSkills(user);

    employeeSkills.forEach((employeeSkillsValue) => {
      const skill = vxm.general.skillsList.find((skillVal: SkillInterface) => {
        return skillVal.id === employeeSkillsValue.skill;
      });
      if (skill) {
        userSkills.push(skill);
      }
    });

    return userSkills;
  }

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

  public checkUserLinkStatistics() {
    this.$gtag.event('User profile', {
      event_category: 'Navigate',
      event_label: `${this.user.firstName} ${this.user.lastName}`,
    });
  }

  get userTechnologies() {
    return this.getUserTechnologies(this.user);
  }

  get checkUserOnVacation() {
    return this.isUserOnVacation(this.user);
  }

  get userRoles() {
    return this.getUserRoles(this.user);
  }

  public getUserSkillPoint(skillLvl: string | undefined): number {
    switch (skillLvl) {
      case UserExperienceEnum.WANT_TO_LEARN : return 0;
      case UserExperienceEnum.SOME_KNOWLEDGE : return 1;
      case UserExperienceEnum.GOOD_KNOWLEDGE : return 2;
      case UserExperienceEnum.EXPERIENCED : return 3;
      case UserExperienceEnum.EXPERT : return 4;
      default: return 0;
    }
  }
}
