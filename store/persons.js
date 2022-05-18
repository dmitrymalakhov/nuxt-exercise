export const MutationTypes = {
  UPDATE_PERSONS: "UPDATE_PERSONS",
  SET_FETCHING: "SET_FETCHING",
  SET_ERROR: "SET_ERROR"
};

export const ActionTypes = {
  GET_PERSONS: "GET_PERSONS"
};

export const state = () => ({
  items: null,
  isError: false,
  isFetching: false
});

export const mutations = {
  [MutationTypes.UPDATE_PERSONS]: (state, items) => {
    state.items = items;
  },
  [MutationTypes.SET_FETCHING]: (state, isFetching) => {
    state.isFetching = isFetching;
  },
  [MutationTypes.SET_ERROR]: (state, isError) => {
    state.isError = isError;
  }
};

export const getters = {
  getFetchingStatus(state) {
    return state.isFetching;
  },
  getFetchingError(state) {
    return state.isError;
  },
  getPersons(state) {
    return state.items;
  }
};

export const actions = {};
