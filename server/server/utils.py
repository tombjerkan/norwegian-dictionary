import bs4
import itertools
import re


def remove_all(root, selector):
    for element in root.select(selector):
        element.decompose()


def take_children_until(root, selector):
    match = root.select_one(selector)
    return itertools.takewhile(lambda e: e != match, root.children)


class TextParser:

    def __init__(self, is_link, get_word_linked_to):
        self._is_link = is_link
        self._get_word_linked_to = get_word_linked_to

    def parse(self, *items):
        result = self._parse_items(*items)
        return re.sub("\\s+", " ", result).strip()

    def _parse_items(self, *items):
        return "".join(self._parse_item(v) for v in items)

    def _parse_item(self, item):
        if isinstance(item, bs4.element.Tag):
            text = self._parse_items(*item.children)
            if self._is_link(item):
                to = self._get_word_linked_to(item)
                return f"<Link to='{to}'>{text}</Link>"
            elif item.name == 'br':
                return '\n'
            else:
                return text
        elif isinstance(item, bs4.element.NavigableString):
            return item.string
        else:
            return ""
