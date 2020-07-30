import { Feed, Post, Status } from "../pages";

export default [
  { label: "Feed", path: "/", component: Feed },
  { label: "Post", path: "/post", component: Post },
  { label: "Status", path: "/status", component: Status },
];
