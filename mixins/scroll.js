import _ from "lodash";

const scroll = {
    data() {
        return {
            sticky: false
        }
    },
    methods: {
        onScrollToToggleScrollTopBtn(e) {
            const { scrollTop, offsetHeight } = e.target;
            this.sticky = scrollTop >= offsetHeight / 2;
            console.log(this.sticky, '---')
        },
        scrollToTop() {
            const scrollDom = this.$refs.scroll?.$el ?this.$refs.scroll.$refs.scroll : this.$refs.scroll;
            scrollDom.scrollTo(0, 0);
        },
    },
    mounted() {
        this.onThrottleScrollToToggleScrollTopBtn = _.throttle(this.onScrollToToggleScrollTopBtn, 100);
    },
}
export default scroll;