<template>
  <div class="grid">
    <div class="column"></div>
    <div class="column content">
      <div
        class="card-wrapper"
        v-for="person in filteredPersons"
        :key="person.name"
      >
        <Card
          :avatar="person.avatar"
          :name="person.name"
          :title="person.title"
          :address="person.address"
          :city="person.city"
          :email="person.email"
          :onSelect="onSelect"
        />
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
  computed: {
    ...mapGetters({
      isFetching: "persons/getFetchingStatus",
      isError: "persons/getFetchingError",
      persons: "persons/getPersons",
    }),
    filteredPersons() {
      return this.persons.slice(0, 2);
    },
  },
  methods: {
    onSelect(id) {
      console.log(id);
    },
  },
  components: {
    Card,
  },
};
</script>