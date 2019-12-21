import itertools


def remove_all(root, selector):
    for element in root.select(selector):
        element.decompose()


def take_children_until(root, selector):
    match = root.select_one(selector)
    return itertools.takewhile(lambda e: e != match, root.children)
