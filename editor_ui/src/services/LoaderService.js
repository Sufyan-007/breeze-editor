function generate_random_id() {
  return Math.random().toString(36).substr(2, 9);
}
function Blocker(message) {
  this._message = message;
  this._el = document.body;
  this._id = generate_random_id();
  let outer = document.createElement("div");
  outer.setAttribute("class", "loader");
  outer.setAttribute("id", this._id);
  let inner = document.createElement("div");
  inner.setAttribute("class", "gui-blocker-msg");
  let msg = document.createElement("div");
  msg.setAttribute("class", "gui-message");
  msg.style.color = "white";
  msg.appendChild(document.createTextNode(message));
  inner.appendChild(msg);
  outer.appendChild(inner);
  document.body.appendChild(outer);
  this._el = document.getElementById(this._id);
}

Blocker.prototype.destroy = function () {
  if (this._el.parentNode) {
    this._el.parentNode.removeChild(this._el);
  } else {
    let el = document.getElementById(this._id);
    if (el) el.parentNode.removeChild(el);
  }
  delete this;
};
Blocker.prototype.hide = function () {
  this._el.style.display = "none";
};
Blocker.prototype.show = function () {
  this._el.style.display = "block";
};
Blocker.prototype.setMessage = function (message) {
  document.getElementById("inner-message").innerText = message;
};
export default Blocker;