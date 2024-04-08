def extract_class_names(rules):
    class_names = set()
    for rule in rules:
        if rule.type == 'qualified-rule':
            prelude = ''.join(token.serialize() for token in rule.prelude)
            selectors = prelude.split(',')
            for selector in selectors:
                if '.' in selector:
                    classes = [part.split('.')[1] for part in selector.split() if '.' in part]
                    class_names.update(classes)
    return class_names
