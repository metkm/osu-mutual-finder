import { createApp } from "vue";
import App from "./App.vue";
import Router from "./router/index";
import Store from "./store/index";
import "./index.css";

const app = createApp(App);

app.directive("transition", {
  mounted(el: HTMLElement) {
    window.onresize = () => {
      const elements = Array.from(el.children) as HTMLElement[];

      let leftOffset = 20;
      elements.forEach(element => {
        element.style.left = `${leftOffset}px`;
        leftOffset += (element.clientWidth + 10);
  
        element.onclick = () => {
          element.setAttribute("style", "top: 0px; left: 0px; width: 100%; height: 100%; z-index: 1; border-radius: 1px;");
          element.innerHTML = "";
        }
      })
    };

    window.dispatchEvent(new Event("resize"))
  }
})

app.use(Router);
app.use(Store);
app.mount("#app");
