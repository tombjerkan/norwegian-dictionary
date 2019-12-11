from server import app

@app.route("/wiktionary/<word>")
def wiktionary(word):
    return {}
