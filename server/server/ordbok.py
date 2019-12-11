from server import app

@app.route("/ordbok/<word>")
def ordbok(word):
    return {}
