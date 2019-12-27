import flask

from server import app, db, marshmallow

class Starred(db.Model):
    term = db.Column(db.Text(), primary_key=True)
    notes = db.Column(db.Text())

    def __repr__(self):
        return f"<Starred term=\"{self.term}\" notes=\"{self.notes}\">"


class StarredSchema(marshmallow.Schema):
    class Meta:
        fields = ("term", "notes")


starred_schema = StarredSchema()
starred_schema_many = StarredSchema(many=True)


@app.route("/api/starred", methods=["GET", "POST"])
def starred():
    if flask.request.method == "POST":
        term = flask.request.json.get("term")
        notes = flask.request.json.get("notes")

        starred = Starred.query.get(term)
        if starred:
            starred.notes = notes
        else:
            new_starred = Starred(term=term, notes=notes)
            db.session.add(new_starred)

        db.session.commit()

        return "", 200

    else:
        return flask.jsonify(starred_schema_many.dump(Starred.query.all()))


@app.route("/api/starred/<word>", methods=["GET", "DELETE"])
def one_starred(word):
    starred = Starred.query.get(word)
    if not starred:
        return "", 404

    if flask.request.method == "GET":
        return starred_schema.dump(starred)
    else:
        db.session.delete(starred)
        db.session.commit()
        return "", 200
