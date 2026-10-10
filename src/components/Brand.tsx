import "./Brand.css";

/** The same folded-page / branching-path emblem is used by the favicon. */
export default function Brand() {
  return (
    <span className="pt-brand">
      <img src="/brand/plottwist-mark.svg" width="48" height="48" alt="" />
      <span className="pt-brand-type">
        <span className="pt-brand-name">Plot<span>Twist</span><i>.</i></span>
        <span className="pt-brand-credit">BY FUTURELAB STUDIOS</span>
      </span>
    </span>
  );
}
