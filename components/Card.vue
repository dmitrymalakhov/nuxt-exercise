<template>
  <div v-bind:class="{ card: true, selected: cardSelected }">
    <div class="avatar-wrapper">
      <img :src="avatar.match(/(.*)\?/g)[0]" />
    </div>
    <div class="description">
      <div class="personal-info">
        <div class="name">
          <v-highlight-text
            :value="name"
            :highlight="getHighlightField('name')"
          />
        </div>
        <div class="title">
          <v-highlight-text
            :value="title"
            :highlight="getHighlightField('title')"
          />
        </div>
        <div class="address">
          <v-highlight-text
            :value="`${address}, ${city}`"
            :highlight="getHighlightField('address')"
          />
        </div>
      </div>
      <button @click="handleSelect">
        <span v-if="cardSelected">SKIP SELECTION</span>
        <span v-else>MARK AS SIUTABLE</span>
      </button>
      <div class="email">
        <v-highlight-text
          :value="email"
          :highlight="getHighlightField('email')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  width: 100%;
  display: flex;
  overflow: hidden;
  background: #FAFAFA;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);
  border-radius: 3px;

  &.selected {
    margin: -1px;
    border: 1px solid #4765FF;
  }

  .avatar-wrapper {
    background: #BBBBBB;
    width: 134px;
    height: 126px;
    text-align: center;

    img {
      width: 94%;
      object-fit: contain;
    }
  }

  .description {
    position: relative;
    flex-grow: 1;

    > button {
      margin: 15px 0 0 32px;
      appearance: none;
      background: #FAFAFA;
      border-width: 0;
      box-sizing: border-box;
      color: #000000;
      cursor: pointer;
      display: inline-block;
      font-family: Clarkson, Helvetica, sans-serif;
      letter-spacing: 0;
      opacity: 1;
      position: relative;
      text-decoration: none;
      text-rendering: geometricprecision;
      text-transform: uppercase;
      user-select: none;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      text-align: center;
      color: #009688;
    }
    .personal-info {
      padding: 10px 0 0 27px;

      .name {
        font-weight: 400;
        font-size: 24px;
        line-height: 32px;
        color: rgba(0, 0, 0, 0.87);
      }

      .title {
        font-weight: 700;
        font-size: 14px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.543846);
      }

      .address {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.543846);
      }
    }

    .email {
      position: absolute;
      top: 10px;
      right: 9px;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.54);
    }
  }
}
</style>

<script>
import HighlightedText from "./HighlightedText";

export default {
  data() {
    return {
      cardSelected: this.selected,
    };
  },
  props: {
    name: String,
    avatar: String,
    title: String,
    address: String,
    city: String,
    email: String,
    highlight: Object,
    selected: Boolean,
  },
  methods: {
    handleSelect() {
      this.cardSelected = !this.cardSelected;
      this.$emit("set-selection", this.name, this.cardSelected);
    },
    getHighlightField(fieldName) {
      return this.highlight ? this.highlight[fieldName] : null;
    },
  },
  components: {
    "v-highlight-text": HighlightedText,
  },
};
</script>