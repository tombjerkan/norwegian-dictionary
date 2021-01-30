def remove_all(root, selector):
    for element in root.select(selector):
        element.decompose()


def remove_attributes(root, exceptions=[]):
    for element in root.find_all():
        attributes = element.attrs.keys()
        attributes_to_delete = [v for v in attributes if v not in exceptions]
        for attribute in attributes_to_delete:
            del element[attribute]
