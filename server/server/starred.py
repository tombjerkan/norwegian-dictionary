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


starred_schema = StarredSchema(many=True)


@app.route("/api/starred", methods=["GET", "POST"])
def starred():
    if flask.request.method == "POST":
        term = flask.request.values.get("term")
        notes = flask.request.values.get("notes")

        starred = Starred.query.get(term)
        if starred:
            starred.notes = notes
        else:
            new_starred = Starred(term=term, notes=notes)
            db.session.add(new_starred)

        db.session.commit()

        return "", 200

    else:
        return flask.jsonify(starred_schema.dump(Starred.query.all()))
