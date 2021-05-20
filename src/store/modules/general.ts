import {action, getter, Module, mutation, VuexModule} from 'vuex-class-component';
import {TABLES} from '@/data/tables';
import {TableInterface} from '@/interfaces/tableInterface';
import {UserInterface} from '@/interfaces/userInterface';
import passportApi from '@/service/passportApi';
import {EmployeeSkillInterface} from '@/interfaces/employeeSkillInterface';
import {AxiosResponse} from 'axios';
import hydraApi from '@/service/hydraApi';
import {EmployeeInterface} from '@/interfaces/employeeInterface';
import {SkillInterface} from '@/interfaces/skillInterface';
import {TechnologyInterface} from '@/interfaces/technologyInterface';
import users from '@/data/users';

@Module({namespacedPath: 'general'})
export class GeneralStore extends VuexModule {
  @getter public currentFloor = 8;
  @getter public users = [] as UserInterface[];
  @getter public tablesStatistic = {} as any;
  @getter public isSidebarOnLeft = true;
  @getter public employees = [] as EmployeeInterface[];
  @getter public employeesSkills = [] as EmployeeSkillInterface[];
  @getter public skillsList = [] as SkillInterface[];
  @getter public technologies = [] as TechnologyInterface[];
  @getter public employeesOnVacation = [] as string[];

  @mutation
  public setUserData(data = []) {
    this.users = data;
  }

  @mutation
  public setTablesStatistic(data = []) {
    const statistic: any = {
      total: {
        all: 0,
        free: 0,
      },
    };
    Object.keys(TABLES).forEach((floor) => {
      statistic[floor] = {};
      statistic[floor].all = (TABLES as any)[floor].length;
      statistic[floor].free = (TABLES as any)[floor].filter(
        (x: TableInterface) =>
          !data.find(
            (y: UserInterface) => x.id === parseInt(y.tableNumber, 10)
          )
      ).length;
      statistic.total.all += statistic[floor].all;
      statistic.total.free += statistic[floor].free;
    });
    this.tablesStatistic = statistic;
  }

  @mutation
  public changeFloor(floor: number) {
    this.currentFloor = floor;
  }

  @mutation
  public changeSidebarPosition(isLeft: boolean) {
    this.isSidebarOnLeft = isLeft;
  }

  @mutation
  public setEmployeesData(data: EmployeeInterface[]) {
    this.employees = data;
  }

  @mutation
  public setEmployeesSkills(data: EmployeeSkillInterface[]) {
    this.employeesSkills = data;
  }

  @mutation
  public setTechnologies(data: TechnologyInterface[]) {
    this.technologies = data;
  }

  @mutation
  public setSkillsList(data: SkillInterface[]) {
    this.skillsList = data;
  }

  @mutation
  public setEmployeesOnVacation(data: string[]) {
    this.employeesOnVacation = data;
  }

  @action
  public async getUsersPassportData() {
    if (process.env.VUE_APP_DEMO_MODE) {
      this.setUserData(users as any);
      this.setTablesStatistic(users as any);
      return;
    }
    return passportApi.getUsersPassportData()
      .then((res: AxiosResponse) => {
        if (res.data) {
          this.setUserData(res.data.items);
          this.setTablesStatistic(res.data.items);
        }
      });
  }

  @action
  public async getEmployeesData() {
    if (process.env.VUE_APP_DEMO_MODE) {
      this.setEmployeesData(users as any);
      return;
    }
    return hydraApi.getEmployeesData().then((res: AxiosResponse) => {
      if (res.data) {
        this.setEmployeesData(res.data.data);
      }
    });
  }

  @action
  public async getEmployeesSkills() {
    if (process.env.VUE_APP_DEMO_MODE) {
      return [];
    }
    return hydraApi.getEmployeesSkills().then((res: AxiosResponse) => {
      if (res.data) {
        this.setEmployeesSkills(res.data.data || []);
      }
    });
  }

  @action
  public async getTechnologies() {
    if (process.env.VUE_APP_DEMO_MODE) {
      return [];
    }
    return hydraApi.getTechnologies().then((res) => {
      if (res.data) {
        this.setTechnologies(res.data.data);
      }
    });
  }

  @action
  public async getEmployeesOnVacation() {
    if (process.env.VUE_APP_DEMO_MODE) {
      return [];
    }
    return hydraApi.getEmployeesOnVacation().then((res: AxiosResponse) => {
      if (res.data) {
        this.setEmployeesOnVacation(res.data.data);
      }
    });
  }

  @action
  public async getSkillsList() {
    if (process.env.VUE_APP_DEMO_MODE) {
      return [];
    }
    return hydraApi.getSkillsList().then((res: AxiosResponse) => {
      if (res.data) {
        this.setSkillsList(res.data.data);
      }
    });
  }
}