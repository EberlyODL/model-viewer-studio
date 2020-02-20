import {
  observable,
  decorate,
  computed,
  action,
  autorun
} from "../web_modules/mobx.js";

const defaultHotspot = Object.assign({ id: "", position: "", normal: "", annotation: "",reference: null, new: true });

class Store {
  constructor() {
    this.modelViewer = null;

    this.editing = true;

    this.activeHotspot = defaultHotspot;
    this.temporaryHotspot = defaultHotspot;
    this.hotspotEditing = false;
  }

  startEditing() {
    this.editing = true;
  }

  stopEditing() {
    this.editing = false;
  }

  save() {
    this.editing = false;
  }

  startHotspotEditing() {
    this.hotspotEditing = true;
    // create a new temporary hotspot to edit.
  }

  updateHotspotPositions({ position, normal }) {
    this.hotspotEditing = false;
    this.activeHotspot.position = position;
    this.activeHotspot.normal = normal;
  }

  updateTemporaryHotspot(position) {
    const slotName = `hotspot-${generateUuid()}`
    let hotspot = `
      <button
        slot="${slotName}"
        data-position="${position.position.toString()}"
        data-normal="${position.normal.toString()}"
        data-visibility-attribute="visible"
      >
    `;
    this.modelViewer.insertAdjacentHTML("beforeend", hotspot);
    const node = this.modelViewer.querySelector(`[slot="${slotName}"]`)
    // remove the old hotspot from DOM
    if (this.temporaryHotspot.reference) {
      this.temporaryHotspot.reference.remove();
    }
    // store this as a temporary hotspot
    this.temporaryHotspot.reference = node;
    this.temporaryHotspot.position = position.position;
    this.temporaryHotspot.normal = position.normal;
    // insert the hotspot into the DOM
  }

  saveTemporaryHotspot() {
  }

  get hotspotIsNew() {
    return this.hotspotIsNew.new === true;
  }

  // get complete() {
  //   // return true
  //   return (this.count > 9)
  // }
}

decorate(Store, {
  modelViewer: observable,

  editing: observable,
  startEditing: action,
  stopEditing: action,
  save: action,

  activeHotspot: observable,
  hotspotEditing: observable,
  hotspotIsNew: computed,
  startHotspotEditing: action,
  temporaryHotspot: observable,
  saveTemporaryHotspot: action

  // complete: computed
});

export const store = new Store();

autorun(() => {
  if (store.temporaryHotspot.reference && store.temporaryHotspot.id) {
    // update id
    store.temporaryHotspot.reference.id = store.temporaryHotspot.id;
  }
  if (store.temporaryHotspot.reference) {
    if (store.temporaryHotspot.annotation) {
      // get the current state of the annotation you
      const currentAnnotation = store.temporaryHotspot.reference.querySelector("*");
      if (!currentAnnotation) {
        let element = document.createElement("div");
        element.id = "annotation";
        element.innerHTML = store.temporaryHotspot.annotation;
        store.temporaryHotspot.reference.appendChild(element);
      }
      else {
        currentAnnotation.innerHTML = store.temporaryHotspot.annotation;
      }
    }
  }
})

const generateUuid = () => {
  return "xxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}