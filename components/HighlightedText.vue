
<style lang="scss" scoped>
.highlight {
  background-color: yellow;
  color: #333;
}
</style>
<script>
export default {
  props: {
    value: String,
    highlight: Array,
  },

  computed: {
    getText() {
      return this.value;
    },
  },
  render(h) {
    const items = this.value.split(this.highlight);
    const newItems = [items[0]];

    for (let i = 1; i < items.length; i++) {
      newItems.push(<span class="highlight">{this.highlight}</span>, items[i]);
    }

    return <span>{newItems}</span>;
  },
};
</script>