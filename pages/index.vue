<template>
  <div class="grid">
    <div class="column"></div>
    <div class="column content">
      <ul>
        <li v-for="person in filteredPersons" :key="person.name">
          <img :src="person.avatar" />
        </li>
      </ul>
    </div>
    <div class="column"></div>
  </div>
</template>

<style scoped>
.grid {
  padding-top: 86px;
  display: grid;
  grid-template-columns: 1fr minmax(400px, 564px) 1fr;
  grid-column-gap: 10px;
}
.content {
  min-height: 100px;
  background: #FFFFFF;
}
</style>

<script>
import { mapGetters } from "vuex";
import { MutationTypes as MutationTypesPersons } from "../store/persons";

export default {
  async fetch({ store }) {
    const persons = await fetch(
      "https://gist.githubusercontent.com/allaud/093aa499998b7843bb10b44ea6ea02dc/raw/c400744999bf4b308f67807729a6635ced0c8644/users.json"
    ).then((res) => res.json());

    store.commit(`persons/${MutationTypesPersons.UPDATE_PERSONS}`, persons);
  },
  computed: {
    ...mapGetters({
      isFetching: "persons/getFetchingStatus",
      isError: "persons/getFetchingError",
      persons: "persons/getPersons",
    }),
    filteredPersons() {
      return this.persons.slice(0, 5);
    },
  },
  methods: {},
  components: {},
};
</script>