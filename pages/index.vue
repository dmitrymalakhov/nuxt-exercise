<template>
  <div class="grid">
    <div class="column"></div>
    <div class="column content">
      <div class="search-panel">
        <div class="icon-wrapper">
          <v-icon name="search" color="#BBBBBB" scale="1.5"></v-icon>
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
    <div class="column"></div>
  </div>
</template>

<style scoped lang="scss">
.card-wrapper {
  &:last-child {
    padding-bottom: 20px;
  }

  padding: 20px 12px 0px 12px;
}

.search-panel {
  background: #FAFAFA;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  margin: 20px 12px 0 12px;
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

  .content {
    min-height: 100px;
    max-height: 643px;
    background: #FFFFFF;
  }
}
</style>

<script>
import { mapGetters } from "vuex";
import Icon from "vue-awesome/components/Icon";
import { MutationTypes as MutationTypesPersons } from "../store/persons";
import Card from "../components/Card";
import "vue-awesome/icons/search";

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
    };
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
        .slice(0, 2);

      return { persons, highlights };
    },
  },
  methods: {
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
  components: {
    "v-card": Card,
    "v-icon": Icon,
  },
};
</script>