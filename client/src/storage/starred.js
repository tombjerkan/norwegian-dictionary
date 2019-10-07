import _ from "lodash";

export function getAll() {
    const json = _.defaultTo(window.localStorage.getItem("starred"), "[]");
    console.log(json);
    return JSON.parse(json);
}

export function get(word) {
    return _.defaultTo(getAll().find(entry => entry.word === word), null);
}

export function add(word, notes) {
    const starredWords = getAll();
    starredWords.push({ word, notes });
    window.localStorage.setItem("starred", JSON.stringify(starredWords));
}

export function remove(word) {
    const updatedWords = getAll().filter(entry => entry.word !== word);
    window.localStorage.setItem("starred", JSON.stringify(updatedWords));
}
