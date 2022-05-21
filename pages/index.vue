<template>
  <div class="grid">
    <div class="column"></div>
    <div class="column wrapper">
      <div class="content" ref="content">
        <div class="search-panel">
          <div class="icon-wrapper">
            <svg
              fill="#BBBBBB"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
              />
            </svg>
          </div>
          <input v-model="querySearch" />
        </div>

        <div :key="querySearch">
          <div
            class="card-wrapper"
            v-for="person in getPersons"
            :key="person.name"
          >
            <v-card
              :avatar="person.avatar"
              :name="person.name"
              :title="person.title"
              :address="person.address"
              :city="person.city"
              :email="person.email"
              :selected="getSelection(person.name)"
              :highlight="getHighlights(person.name)"
              @set-selection="setSelection"
            />
          </div>
        </div>
      </div>
      <div class="scrollbar" />
    </div>
    <div class="column"></div>
  </div>
</template>

<style scoped lang="scss">
.card-wrapper {
  &:last-child {
    padding-bottom: 20px;
  }

  padding: 20px 0px 0px 0px;
}

.search-panel {
  background: #FAFAFA;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  display: flex;

  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }

  > input {
    flex-grow: 1;
    padding: 12px 0 7px 0px;
    background: transparent;
    border: none;
    outline: none;
    font-weight: 400;
    font-size: 24px;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.75);
  }
}

.grid {
  padding-top: 86px;
  display: grid;
  grid-template-columns: 1fr minmax(400px, 564px) 1fr;
  grid-column-gap: 10px;

  .wrapper {
    background: #FFFFFF;
    padding: 19px 14px 0px 10px;
    display: flex;

    .scrollbar {
      background: #BBBBBB;
      width: 1px;
      margin: 0px 0px 10px 0px;
      opacity: 0.2;
    }

    .content {
      min-height: 100px;
      max-height: 643px;
      overflow-y: auto;
      z-index: 1;
      margin: 0px -3px 10px 0px;
      padding: 0px 10px 0px 2px;
      flex-grow: 1;

      &::-webkit-scrollbar {
        width: 4px;
        border: none;
      }

      &::-webkit-scrollbar-thumb {
        background: #4D4D4D;
        border-radius: 2px;
        width: 4px;
      }
    }
  }
}
</style>

<script>
import { mapGetters } from "vuex";
import debounce from "lodash.debounce";
import { MutationTypes as MutationTypesPersons } from "../store/persons";
import Card from "../components/Card";

export default {
  async fetch({ store }) {
    const persons = await fetch(
      "https://gist.githubusercontent.com/allaud/093aa499998b7843bb10b44ea6ea02dc/raw/c400744999bf4b308f67807729a6635ced0c8644/users.json"
    ).then((res) => res.json());

    store.commit(`persons/${MutationTypesPersons.UPDATE_PERSONS}`, persons);
  },
  data() {
    return {
      querySearch: "",
      selectedItems: {},
      handleDebouncedScroll: null,
      limitItems: 10,
    };
  },
  mounted() {
    this.handleDebouncedScroll = debounce(this.handleScroll, 100);
    this.$refs.content.addEventListener("scroll", this.handleDebouncedScroll);
  },

  beforeDestroy() {
    this.$refs.content.removeEventListener(
      "scroll",
      this.handleDebouncedScroll
    );
  },
  computed: {
    ...mapGetters({
      isFetching: "persons/getFetchingStatus",
      isError: "persons/getFetchingError",
      persons: "persons/getPersons",
    }),
    getPersons() {
      return this.filteredPersons.persons;
    },
    filteredPersons() {
      const regex = new RegExp(this.querySearch, "gi");
      const highlights = {};

      const persons = this.persons
        .filter((item, index) => {
          if (!this.querySearch) return true;

          const matchedName = regex.exec(item.name);
          const matchedTitle = regex.exec(item.title);
          const matchedEmail = regex.exec(item.email);
          const matchedAddress = regex.exec(`${item.address}, ${item.city}`);

          const isMatched =
            matchedName || matchedTitle || matchedEmail || matchedAddress;

          if (isMatched)
            highlights[item.name] = {
              name: matchedName,
              title: matchedTitle,
              email: matchedEmail,
              address: matchedAddress,
            };

          return isMatched;
        })
        .slice(0, this.limitItems);

      return { persons, highlights };
    },
  },
  methods: {
    handleScroll(event) {
      if (
        this.$refs.content.offsetHeight + this.$refs.content.scrollTop >=
        this.$refs.content.scrollHeight / 2
      )
        this.limitItems = this.limitItems + 5;
    },
    getHighlights(index) {
      return this.filteredPersons.highlights[index];
    },
    setSelection(index, state) {
      this.selectedItems[index] = state;
    },
    getSelection(index) {
      return this.selectedItems[index] ? this.selectedItems[index] : false;
    },
  },
  watch: {
    querySearch() {
      this.limitItems = 10;
    },
  },
  components: {
    "v-card": Card,
  },
};
</script>