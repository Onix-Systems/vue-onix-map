<template lang="pug">
  .search-container(v-click-outside="closeDropdown" :class="[{expand: showDropdown, 'beButton': !showDropdown}]")
    .input-box(@click="clickOnInput")
      input(
        type="text"
        v-model="query"
        :placeholder="placeholder"
        @change="changeInput(query)"
      )
      .search-icon
    .dropdown(v-if="showDropdown" :class="{left: !isSidebarOnLeft}")
      .dropdown-container
        .dropdown-header
          .scroll-buttons
            button(
              v-scroll-to="{ el: '#peoples', container: '#scroll-container' }"
              @click="scrollToBlock('People')"
            ) {{$t('people')}}
              span  {{ filteredUsers.length }}
            button(
              v-scroll-to="{ el: '#skills', container: '#scroll-container' }"
              @click="scrollToBlock('Skills')"
            ) {{$tc('skill', 2)}}
              span  {{ filteredSkills.length }}
            button(
              v-scroll-to="{ el: '#technologies', container: '#scroll-container' }"
              @click="scrollToBlock('Technologies')"
            ) {{$tc('technology', 2)}}
              span  {{ filteredTechnologies.length }}
            button.close(@click="showDropdown = false, $emit('searchIsActive', false)")
          .sort-block(v-click-outside="closeSort")
            .sort-label {{$t('search.sort.label')}}
              button(@click="showSort = !showSort" :class="{'arrow-up': showSort}") {{$t(`search.sort.type.${currentSort}`)}}
            .sort-dropdown(v-if="showSort")
              ul(@click.stop="showSort = false")
                li(
                  @click="changeSort(searchSort.Floor)"
                  :class="{active: currentSort === searchSort.Floor}"
                ) {{$t(`search.sort.type.${searchSort.Floor}`)}}
                li(
                  @click="changeSort(searchSort.Experience)"
                  :class="{active: currentSort === searchSort.Experience}"
                ) {{$t(`search.sort.type.${searchSort.Experience}`)}}
                li(
                  @click="changeSort(searchSort.NearestBirthday)"
                  :class="{active: currentSort === searchSort.NearestBirthday}"
                ) {{$t(`search.sort.type.${searchSort.NearestBirthday}`)}}
        .search-result#scroll-container
          the-loader(v-if="isSearching")
          template(v-if="!isSearching")
            section(v-if="filteredUsers.length")
              .title#peoples {{$t('people')}}
              template(v-if="currentSort === searchSort.Floor")
                .floor-block(v-for="floor in floors" :key="floor")
                  template(v-if="getUsersByFloor(filteredUsers, floor).length")
                    .floor-label {{floor !== 0 ? floor : ''}}
                      span {{floor !== 0 ? ` ${$tc('floor')}` : $t('remote')}}
                    .users-list
                      .user-block(
                        v-for="user in getUsersByFloor(filteredUsers, floor)"
                      )
                        user-search-card(
                          :user="user"
                          :query="query"
                          :sort="currentSort"
                          section="users"
                          @selectUser="selectUser(user)"
                        )
              template(v-if="currentSort !== searchSort.Floor")
                .users-list
                  .user-block(
                    v-for="user in filteredUsers"
                  )
                    user-search-card(:user="user" :query="query" :sort="currentSort" @selectUser="selectUser(user)")
            section(v-if="filteredSkills.length")
              .title#skills {{$tc('skill', 2)}}
                template(v-if="listOfSkills.length")  (
                  span(
                    v-for="(skill, i) in listOfSkills"
                    v-html="$options.filters.wrapText(skill + (i === listOfSkills.length - 1 ? '' : ', '), query)"
                  )
                  | )
              .users-list
                template(v-for="user in filteredSkills")
                  user-search-card(
                  :user="user"
                  :query="query"
                  :sort="currentSort"
                  :skillList="listOfSkills"
                  section="skills"
                  @selectUser="selectUser(user)"
                )
            section(v-if="filteredTechnologies.length")
              .title#technologies {{$tc('technology', 2)}}
                template(v-if="listOfTechnologies.length")  (
                  span(
                    v-for="(tech, i) in listOfTechnologies"
                    v-html="$options.filters.wrapText(tech + (i === listOfTechnologies.length - 1 ? '' : ', '), query)"
                  )
                  | )
              .users-list
                template(v-for="user in filteredTechnologies")
                  user-search-card(
                    :user="user"
                    :query="query"
                    :sort="currentSort"
                    section="technologies"
                    @selectUser="selectUser(user)"
                  )
            .no-matches(v-if="!filteredUsers.length && !filteredSkills.length && !filteredTechnologies.length") {{$t('search.noMatches')}}

</template>

<script lang="ts">
import ClickOutside from '@/directives/clickOutside';
import {UserInterface} from '@/interfaces/userInterface';
import {vxm} from '@/store';
import {Component, Mixins, Watch} from 'vue-property-decorator';
import UserSearchCard from '@/components/UserSearchCard.vue';
import TheLoader from '@/components/TheLoader.vue';
import {SearchSortEnum} from '@/enums/SearchSortEnum';
import moment, {Moment} from 'moment';
import CommonMixin from '@/components/mixins/CommonMixin';
import UserMixin from '@/components/mixins/UserMixin';
import {UserExperienceEnum} from '@/enums/UserExperienceEnum';
import {SkillInterface} from '@/interfaces/skillInterface';
import {EmployeeSkillInterface} from '@/interfaces/employeeSkillInterface';


@Component({
  components: {UserSearchCard, TheLoader},
  directives: {ClickOutside},
})
export default class CustomSearch extends Mixins(CommonMixin, UserMixin) {
  public query: string = '';
  public showDropdown: boolean = false;
  public showSort: boolean = false;
  public listOfSkills: string[] = [];
  public listOfTechnologies: string[] = [];
  public currentSort: string = SearchSortEnum.Floor;
  public searchSort = SearchSortEnum;
  public floors: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  public filteredUsers: UserInterface[] = [];
  public filteredSkills: UserInterface[] = [];
  public filteredTechnologies: UserInterface[] = [];
  public isSearching: boolean = true;
  public debouncedUpdateSearchResult = this.debounce(this.updateSearchResult, 700, false);
  public userExpEnum = UserExperienceEnum;
  public skillsCategory: string[] = [];

  public mounted() {
    this.skillsCategory = [
      this.userExpEnum.WANT_TO_LEARN,
      this.userExpEnum.SOME_KNOWLEDGE,
      this.userExpEnum.GOOD_KNOWLEDGE,
      this.userExpEnum.EXPERIENCED,
      this.userExpEnum.EXPERT,
    ];

    if (this.$route.query.s && this.$route.query.s !== this.query) {
      this.query = this.$route.query.s as string;
      this.showDropdown = true;
    }
    if (this.$route.query.sort && this.$route.query.sort !== this.currentSort) {
      this.currentSort = this.$route.query.sort as string;
      this.showDropdown = true;
    }
    this.updateSearchResult();
  }

  @Watch('query')
  public onQueryUpdate() {
    this.isSearching = true;
    this.debouncedUpdateSearchResult();
  }

  public updateSearchResult() {
    if (
      this.showDropdown &&
      (this.$route.query.s !== this.query || this.$route.query.sort !== this.currentSort)
    ) {
      this.$router.push({query: {s: this.query, sort: this.currentSort}});
    }

    Promise.all([
      this.getFilteredUsers(),
      this.getFilteredSkills(),
      this.getFilteredTechnologies(),
    ]).then((data) => {
      this.filteredUsers = data[0];
      this.filteredSkills = data[1];
      this.filteredTechnologies = data[2];
      this.isSearching = false;
    });
  }

  get placeholder() {
    return window.innerWidth > 400 ? this.$t('search.placeholder.full') : this.$t('search.placeholder.small');
  }

  public getFilteredUsers(): Promise<UserInterface[]> {
    return new Promise<UserInterface[]>((resolve) => {
      let users = this.sortedUsers;

      if (this.query.length >= 2) {
        const q = this.query.toLowerCase();
        users = users.filter((x) => x.firstName.toLowerCase().indexOf(q) >= 0 ||
          x.lastName.toLowerCase().indexOf(q) >= 0 || x.firstNameRu.toLowerCase().indexOf(q) >= 0 ||
          x.lastNameRu.toLowerCase().indexOf(q) >= 0);
      }
      resolve(users);
    });
  }

  public getFilteredSkills(): Promise<UserInterface[]> {
    return new Promise<UserInterface[]>((resolve) => {
      if (this.query.length >= 2) {
        const q = this.query.toLowerCase();
        this.listOfSkills = [];
        resolve(this.simpleSkillSort(this.findUsersWithSkill(this.addFilteredSkill(q))) );
      } else {
        resolve([]);
      }
    });
  }

  public getFilteredTechnologies(): Promise<UserInterface[]> {
    return new Promise<UserInterface[]>((resolve) => {
      if (this.query.length >= 2) {
        const q = this.query.toLowerCase();
        this.listOfTechnologies = [];
        resolve(
          this.sortedUsers.filter((user) => this.getUserTechnologies(user).find((technology) => {
            const index = technology.name.toLowerCase().indexOf(q) >= 0;
            if (index && this.listOfTechnologies.indexOf(technology.name) === -1) {
              this.listOfTechnologies.push(technology.name);
            }
            return index;
          })),
        );
      } else {
        resolve([]);
      }
    });
  }

  get usersByExperience(): UserInterface[] {

    return vxm.general.users.slice().sort((user1: any, user2: any) => {
        return moment(user1.workStartDate).valueOf() - moment(user2.workStartDate).valueOf();
      },
    );
  }

  get usersByBirthday(): UserInterface[] {
    return vxm.general.users.slice().sort((user1: any, user2: any) => {
      const birthday1 = this.getNextBirthday(user1.birthDate);
      const birthday2 = this.getNextBirthday(user2.birthDate);
      /*if have NaN values try to convert them into something readable*/
      if (!birthday1.valueOf() || !birthday2.valueOf()) {
        return !birthday1.valueOf() && !birthday2.valueOf() ? 0 : !birthday1.valueOf() ? 1 : -1;
      }
      return birthday1.valueOf() > birthday2.valueOf() ? 1 : birthday1.valueOf() === birthday2.valueOf() ? 0 : -1;
    });
  }

  get sortedUsers(): UserInterface[] {
    if (this.currentSort === SearchSortEnum.Experience) {
      return this.usersByExperience;
    }

    if (this.currentSort === SearchSortEnum.NearestBirthday) {
      return this.usersByBirthday;
    }

    return vxm.general.users;
  }

  get isSidebarOnLeft(): boolean {
    return vxm.general.isSidebarOnLeft;
  }

  public getUsersByFloor(users: UserInterface[], floor: number): UserInterface[] {
    return users.filter((user) => {
      // for remote users
      if (floor === 0) {
        return user.tableNumber === null;
      }

      return Math.floor(parseInt(user.tableNumber, 10) / 100) === floor;
    });
  }

  public getNextBirthday(date: string): Moment {
    const currentYear = moment().year();
    const birthday: Moment = moment(date).year(currentYear);

    if (birthday.isBefore(moment(), 'day')) {
      birthday.year(currentYear + 1);
    }

    return birthday;
  }

  public selectUser(user: UserInterface) {
    this.query = '';
    this.$emit('selected', user);
    this.closeDropdown();
  }

  public closeDropdown() {
    if (this.showDropdown) {
      this.query = '';
      this.showDropdown = false;
      this.$emit('searchIsActive', false);
    }
  }

  public closeSort() {
    this.showSort = false;
  }

  public changeInput(query: string) {
    this.$gtag.event('Search text', {
      event_category: 'Search users',
      event_label: query,
    });
  }

  public changeSort(sort: string) {
    this.currentSort = sort;
    this.isSearching = true;
    this.updateSearchResult();
    this.$gtag.event('Change search sort', {
      event_category: 'Search users',
      event_label: sort,
    });
  }

  public clickOnInput() {
    this.showDropdown = true;
    this.$gtag.event('Click on search input', {
      event_category: 'Search users',
    });
    this.$emit('searchIsActive', true);
  }

  public scrollToBlock(blockName: string) {
    this.$gtag.event('Scroll to block on search result list', {
      event_category: 'Search users',
      event_label: blockName,
    });
  }
  /**
   * Take query input and data from this.sortedUsers add new data to the users.
   * Also fill this.listOfSkills with all similar skills
   * @param query string used to filter result
   * @param exaltSearch if true return a skill exactly to query, otherwise return all similar to it
   * @return modified user, add skill and it's lvl
   */
  public addFilteredSkill(query: string, exaltSearch = false): UserInterface[] {
    return this.sortedUsers.map( (user: UserInterface) => {
      /*reset data*/
      user.filteredSkillName = undefined;
      user.filteredSkillLvl = undefined;

      this.getUserSkills(user).find((skill) => {

        const index = skill.name.toLowerCase().indexOf(query) >= 0;
        if (index) {
          /*to get user skill name we have skill.id to search*/
          const userSkill = this.findUserSkill(user, skill.id);
          if (userSkill) {
            user.filteredSkillName = skill.name; // add new data
            user.filteredSkillLvl = userSkill.usageLevel; // add new data
          }
        }
        if (index && this.listOfSkills.indexOf(skill.name) === -1) {
          this.listOfSkills.push(skill.name);
        }
        return index;
      });
      return user;
    });
  }

  public findUsersWithSkill(users: UserInterface[]): UserInterface[] {
    return users.filter( (user: UserInterface) => user.filteredSkillLvl );
  }

  public findUserSkill(user: UserInterface, id: string): EmployeeSkillInterface | undefined {
    return this.getEmployeeSkills(user).find( (idToCompare: EmployeeSkillInterface) => {
      return idToCompare.skill === id;
    });
  }

  private simpleSkillSort(users: UserInterface[]): UserInterface[] {
    users.sort( (user1, user2) => {
        const result = this.getUserSkillPoint(user2.filteredSkillLvl) - this.getUserSkillPoint(user1.filteredSkillLvl);
        return result > 0 ? 1 : result < 0 ? -1 : 0;
      },
    );
    return users.sort( (user1, user2) => {
      return (user1.filteredSkillName || '').localeCompare(user2.filteredSkillName || '');
    });
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/scss/media";

  .search-container {
    flex-basis: 400px;
    min-width: 110px;
    display: flex;
    justify-content: center;

    &.expand {
      min-width: 400px;
      left: 304px;
      z-index: 3;
      @media only screen and (max-width: 768px) {
        left: 60px;
      }
      @include media_mobile {
        left: 44px;
      }
      @media only screen and (max-width: 465px) {
        min-width: 280px;
      }
      @media only screen and (max-width: 340px) {
        min-width: 240px;
      }
    }

    .input-box {
      display: flex;
      align-items: center;
      max-width: 400px;
      width: 100%;
      border: 1px solid #E2E6ED;
      border-radius: 25px;
      padding: 0 16px;
      background-color: #ffffff;
      cursor: pointer;

      input {
        height: 36px;
        width: 100%;
        color: #888888;
        display: flex;
        flex-wrap: wrap;
        outline: none;
        border: none;
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;
      }

      .search-icon {
        background: url("../assets/images/loupe.svg") center center no-repeat;
        width: 36px;
        height: 36px;
        margin-right: -10px;
      }
    }

    .dropdown {
      position: fixed;
      right: 0;
      top: 57px;
      height: calc(100% - 57px);

      &.left {
        right: 72px;
        @include media_mobile {
          right: 0;
        }
      }

      .dropdown-container {
        background-color: #ffffff;
        width: calc(100vw - 72px);
        padding: 24px 0 0 24px;
        height: 100%;
        display: flex;
        flex-direction: column;
        @include media_mobile {
          width: 100vw;
        }
        @media only screen and (max-width: 539px) {
          padding-left: 0;
        }
      }

      .dropdown-header {
        display: flex;
        align-items: center;
        align-self: flex-end;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 20px;
        min-height: 35px;
        @include media_mobile {
          flex-direction: column;
          align-items: flex-start;
          min-height: 93px;
        }
        @media only screen and (max-width: 539px) {
          padding-left: 16px;
        }
      }

      .scroll-buttons {
        display: flex;
        margin-left: calc(50% - 270px);
        align-items: center;

        .close {
          border: none;
          background: url("../assets/images/close.svg") center center no-repeat;
          padding: 10px;
          cursor: pointer;
          border-radius: 0;
        }

        @include media_tablet {
          margin-left: initial;
        }

        button {
          margin: 0 10px;
          padding: 10px 15px;
          background: #E6F1FF;
          border-radius: 4px;
          outline: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 600;
          font-size: 12px;
          line-height: 15px;
          color: #0072FF;
          text-transform: capitalize;
          @media only screen and (max-width: 340px) {
            margin: 0 5px;
          }

          span {
            color: #99C7FF;
            font-weight: 500;
          }
        }
      }

      .sort-block {
        font-family: 'Inter', sans-serif;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        position: relative;
        margin: 0 24px 0 auto;
        @include media_mobile {
          margin-left: 10px;
          margin-top: 14px;
        }

        .sort-label {
          padding: 4px 0;

          button {
            outline: none;
            border: none;
            background: #FFFFFF;
            color: #0072FF;
            text-transform: capitalize;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 17px;
            padding-right: 18px;

            &:after {
              content: "";
              position: absolute;
              background: url("../assets/images/header-icons/header_down-arrow.svg") no-repeat;
              width: 6px;
              height: 4px;
              top: 12px;
              right: 5px;
              transition: transform 500ms;
            }

            &.arrow-up {
              &:after {
                transform: rotate(180deg);
              }
            }
          }
        }

        .sort-dropdown {
          position: absolute;
          display: flex;
          right: 0;
          border: 1px solid #E2E6ED;
          box-shadow: 0 4px 8px rgba(43, 44, 48, 0.1);
          border-radius: 4px;
          background: #FFFFFF;
          min-width: 150px;
          max-width: 400px;
          @include media_mobile {
            right: initial;
            left: 0;
          }

          ul {
            font-weight: normal;
            font-size: 14px;
            line-height: 32px;
            display: flex;
            flex-direction: column;
            width: 100%;

            li {
              cursor: pointer;
              text-transform: capitalize;
              padding: 8px 16px;
              width: 100%;

              &.active {
                color: #0072FF;
                font-weight: 600;
              }

              &:hover {
                background: #EBEEF2;
              }
            }
          }
        }
      }

      .search-result {
        overflow-y: auto;
        margin-right: 8px;

        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-track {
          border-radius: 1000px;
          background: #F8FBFF;
        }

        &::-webkit-scrollbar-thumb {
          color: blue;
          border-radius: 1000px;
          background: #E5E5E5;

          &:hover {
            background: #9EA3AF;
          }
        }
      }

      .title {
        font-family: 'Open Sans', sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 33px;
        color: #2B2C30;
        margin: 8px 0 24px 16px;
        text-transform: capitalize;

        span {
          font-size: 20px;
          line-height: 24px;

          /deep/
          span {
            background-color: #fde910;
            font-style: normal;
            display: inline-block;
            padding: 0 1px;
            margin-bottom: 0;
            margin-top: -3px;
            line-height: 19px;
            color: #333333;
            text-align: center;
            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
            vertical-align: middle;
            background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fcdd76), to(#ffd700));
            background-image: -webkit-linear-gradient(top, #fcdd76, #ffd700);
            background-image: -o-linear-gradient(top, #fcdd76, #ffd700);
            background-image: linear-gradient(to bottom, #fcdd76, #ffd700);
            background-image: -moz-linear-gradient(top, #fcdd76, #ffd700);
            background-repeat: repeat-x;
            border: 1px solid #bbbbbb;
            border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
            border-color: #ffd700 #ffd700 #bfbfbf;
            border-bottom-color: #a2a2a2;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            filter: progid:dximagetransform.microsoft.gradient(startColorstr='#fcdd76ff', endColorstr='#ffffd700', GradientType=0);
            filter: progid:dximagetransform.microsoft.gradient(enabled=false);
            -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
            -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
          }
        }
      }

      .floor-label {
        font-family: 'Open Sans', sans-serif;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 33px;
        color: #2B2C30;
        margin: 0 0 24px 16px;

        span {
          font-size: 16px;
          text-transform: uppercase;
        }
      }

      .users-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        overflow-y: auto;
        padding-bottom: 10px;
        @media only screen and (max-width: 539px) {
          flex-direction: column;
        }
      }

      .no-matches {
        text-align: center;
      }
    }
  }

  @media only screen and (max-width: 430px) {
    .beButton {
      min-width: 36px;
      flex-basis: 36px;
      .input-box {
        width: 36px;
        height: 36px;
        padding: 0;
        vertical-align: middle;
        input {
          display: none;
        }
        .search-icon {
          margin-right: 1px;
        }
      }
    }
  }

</style>
