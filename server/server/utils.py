import bs4
import itertools
import re


def remove_all(root, selector):
    for element in root.select(selector):
        element.decompose()


def take_children_until(root, selector):
    match = root.select_one(selector)
    return itertools.takewhile(lambda e: e != match, root.children)


def create_text_parser(is_link, get_word_linked_to):
    def parse_items(*items):
        return "".join(parse_item(v) for v in items)

    def parse_item(item):
        if isinstance(item, bs4.element.Tag):
            text = parse_items(*item.children)
            if is_link(item):
                to = get_word_linked_to(item)
                return f"<Link to='{to}'>{text}</Link>"
            elif item.name == 'br':
                return '\n'
            else:
                return text
        elif isinstance(item, bs4.element.NavigableString):
            return item.string
        else:
            return ""

    def parse(*items):
        result = parse_items(*items)
        return re.sub(r"\s+", " ", result).strip()

    return parse
