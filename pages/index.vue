<template>
  <div class="grid">
    <div class="column"></div>
    <div class="column content">
      <input v-model="querySearch" />
      <div :key="querySearch">
        <div
          class="card-wrapper"
          v-for="person in getPersons"
          :key="person.name"
        >
          <Card
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

.grid {
  padding-top: 86px;
  display: grid;
  grid-template-columns: 1fr minmax(400px, 564px) 1fr;
  grid-column-gap: 10px;

  .content {
    min-height: 100px;
    background: #FFFFFF;
  }
}
</style>

<script>
import { mapGetters } from "vuex";
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
    Card,
  },
};
</script>