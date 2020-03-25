<template lang="pug">
  .search-container(v-click-outside="closeDropdown" :class="[{expand: showDropdown, 'beButton': !showDropdown}]")
    .input-box(@click="clickOnInput")
      input(
        type="text"
        v-model="query"
        :placeholder="inputText"
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
            ) People
              span  {{ filteredUsers.length }}
            button(
              v-scroll-to="{ el: '#skills', container: '#scroll-container' }"
              @click="scrollToBlock('Skills')"
            ) Skills
              span  {{ filteredSkills.length }}
            button(
              v-scroll-to="{ el: '#technologies', container: '#scroll-container' }"
              @click="scrollToBlock('Technologies')"
            ) Technologies
              span  {{ filteredTechnologies.length }}
            button.close(@click="showDropdown = false, $emit('searchIsActive', false)")
          .sort-block(v-click-outside="closeSort")
            .sort-label Sort by:&nbsp
              button(@click="showSort = !showSort" :class="{'arrow-up': showSort}") {{ currentSort }}
            .sort-dropdown(v-if="showSort")
              ul(@click.stop="showSort = false")
                li(
                  @click="changeSort(searchSort.Floor)"
                  :class="{active: currentSort === searchSort.Floor}"
                ) {{ searchSort.Floor }}
                li(
                  @click="changeSort(searchSort.Experience)"
                  :class="{active: currentSort === searchSort.Experience}"
                ) {{ searchSort.Experience }}
                li(
                  @click="changeSort(searchSort.NearestBirthday)"
                  :class="{active: currentSort === searchSort.NearestBirthday}"
                ) {{ searchSort.NearestBirthday }}
        .search-result#scroll-container
          section(v-if="filteredUsers.length")
            .title#peoples People
            template(v-if="currentSort === searchSort.Floor")
              .floor-block(v-for="floor in floors" :key="floor")
                template(v-if="getUsersByFloor(filteredUsers, floor).length")
                  .floor-label {{floor !== 0 ? floor : ''}}
                    span {{floor !== 0 ? ' FLOOR' : 'REMOTE'}}
                  .users-list
                    .user-block(
                      v-for="user in getUsersByFloor(filteredUsers, floor)"
                    )
                      user-search-card(:user="user" :query="query" :sort="currentSort" @selectUser="selectUser(user)")
            template(v-if="currentSort !== searchSort.Floor")
              .users-list
                .user-block(
                  v-for="user in filteredUsers"
                )
                  user-search-card(:user="user" :query="query" :sort="currentSort" @selectUser="selectUser(user)")
          section(v-if="filteredSkills.length")
            .title#skills Skills
              template(v-if="listOfSkills.length")  (
                span(
                  v-for="(skill, i) in listOfSkills"
                  v-html="$options.filters.wrapText(skill + (i === listOfSkills.length - 1 ? '' : ', '), query)"
                )
                | )
            .users-list
              template(v-for="user in filteredSkills")
                user-search-card(:user="user" :query="query" :sort="currentSort" @selectUser="selectUser(user)")
          section(v-if="filteredTechnologies.length")
            .title#technologies Technologies
              template(v-if="listOfTechnologies.length")  (
                span(
                  v-for="(tech, i) in listOfTechnologies"
                  v-html="$options.filters.wrapText(tech + (i === listOfTechnologies.length - 1 ? '' : ', '), query)"
                )
                | )
            .users-list
              template(v-for="user in filteredTechnologies")
                user-search-card(:user="user" :query="query" :sort="currentSort" @selectUser="selectUser(user)")
          .no-matches(v-if="!filteredUsers.length && !filteredSkills.length && !filteredTechnologies.length") No matches found.

</template>

<script lang="ts">
import ClickOutside from '@/directives/clickOutside';
import {UserInterface} from '@/interfaces/userInterface';
import {store} from '@/store';
import {Component, Mixins} from 'vue-property-decorator';
import UserSearchCard from '@/components/UserSearchCard.vue';
import {SearchSortEnum} from '@/enums/SearchSortEnum';
import moment, {Moment} from 'moment';
import UserMixin from '@/components/mixins/UserMixin';


@Component({
  components: {UserSearchCard},
  directives: {ClickOutside},
})
export default class CustomSearch extends Mixins(UserMixin) {
  public query: string = '';
  public showDropdown: boolean = false;
  public showSort: boolean = false;
  public listOfSkills: string[] = [];
  public listOfTechnologies: string[] = [];
  public currentSort: string = SearchSortEnum.Floor;
  public searchSort = SearchSortEnum;
  public floors: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  public inputText = '';

  public mounted() {
    this.setInputText();
  }
  public setInputText() {
    const width = window.innerWidth;
    this.inputText = width > 400 ? 'Search by Name, Project, Skills, Other' : 'Name, Project, Skills, Other..';
  }

  get filteredUsers(): UserInterface[] {
    let users = this.sortedUsers;

    if (this.query.length >= 2) {
      const q = this.query.toLowerCase();
      users = users.filter((x) => x.firstName.toLowerCase().indexOf(q) >= 0 ||
        x.lastName.toLowerCase().indexOf(q) >= 0 || x.firstNameRu.toLowerCase().indexOf(q) >= 0 ||
        x.lastNameRu.toLowerCase().indexOf(q) >= 0);
    }

    return users;
  }

  get filteredSkills(): UserInterface[] {
    if (this.query.length >= 2) {
      const q = this.query.toLowerCase();
      this.listOfSkills = [];
      return this.sortedUsers.filter((x) => x.skills.find((y) => {
        const index = y.name.toLowerCase().indexOf(q) >= 0;
        if (index && this.listOfSkills.indexOf(y.name) === -1) {
          this.listOfSkills.push(y.name);
        }
        return index;
      }));
    } else {
      return [];
    }
  }

  get filteredTechnologies(): UserInterface[] {
    if (this.query.length >= 2) {
      const q = this.query.toLowerCase();
      this.listOfTechnologies = [];
      return this.sortedUsers.filter((x) => x.technologies.find((y) => {
        const index = y.name.toLowerCase().indexOf(q) >= 0;
        if (index && this.listOfTechnologies.indexOf(y.name) === -1) {
          this.listOfTechnologies.push(y.name);
        }
        return index;
      }));
    } else {
      return [];
    }
  }

  get usersByExperience(): UserInterface[] {
    return store.state.users.slice().sort((user1, user2) => {
      return moment(user1.workStartDate).valueOf() - moment(user2.workStartDate).valueOf();
      },
    );
  }

  get usersByBirthday(): UserInterface[] {
    return store.state.users.slice().sort((user1, user2) => {
      const birthday1 = this.getNextBirthday(user1.birthDate);
      const birthday2 = this.getNextBirthday(user2.birthDate);
      return birthday1.valueOf() - birthday2.valueOf();
    });
  }

  get sortedUsers(): UserInterface[] {
    if (this.currentSort === SearchSortEnum.Experience) {
      return this.usersByExperience;
    }

    if (this.currentSort === SearchSortEnum.NearestBirthday) {
      return this.usersByBirthday;
    }

    return store.state.users;
  }

  get isSidebarOnLeft(): boolean {
    return store.state.isSidebarOnLeft;
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
        height: calc(100vh - 57px);
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
        @include media_mobile {
          flex-direction: column;
          align-items: flex-start;
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
          @media only screen and (max-width: 340px) {
            margin: 0 5px;
          }

          span {
            color: #99C7FF;
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
