import TokenCard from "../components/TokenCard.vue";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

export default {
  title: "TokenCard",
  component: TokenCard,
  argTypes: {
    tokenId: { type: "number" },
    url: { type: "string" },
    api: { type: "string" }
  },
};

const Template = (args) => ({
  components: { TokenCard },
  setup() {
    return { args };
  },
  template: '<token-card v-bind="args" />',
});

export const Primary = Template.bind({});
Primary.args = {
  tokenId: 0,
  url: "https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png",
  api: ""
};
