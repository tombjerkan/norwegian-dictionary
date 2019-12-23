import flask

from server import app, db, ApiError

class Starred(db.Model):
    term = db.Column(db.Text(), primary_key=True)
    notes = db.Column(db.Text())

    def __repr__(self):
        return f"<Starred term=\"{self.term}\" notes=\"{self.notes}\">"


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
        return flask.jsonify([
            { "term": v.term, "notes": v.notes }
            for v in Starred.query.all()
        ])