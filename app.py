from flask import Flask, render_template, request, send_file
import os
import json


app = Flask(__name__)

jinja_options = app.jinja_options.copy()

jinja_options.update(dict(
    block_start_string='<%',
    block_end_string='%>',
    variable_start_string='%%',
    variable_end_string='%%',
    comment_start_string='<#',
    comment_end_string='#>'
))
app.jinja_options = jinja_options

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/paper')
def paper():
    return render_template("paper.html")


@app.route('/markscheme')
def markscheme():
    return render_template("markscheme.html")


@app.route('/generatePaper', methods=['POST'])
def generatePaper():
    data = json.loads(request.data.decode())

    subject = data['subject']
    with open('templates/paper.html', 'w') as out:
        with open('output_start.html') as start:
            out.write(start.read())

        for idx, question in enumerate(data['questions']):
            out.write('<h3>Q' + str(idx + 1) + '</h3>\n')
            with open('static/angulartemplates/' + subject + '/' + question + 'q.html') as f:
                out.write(f.read() + '\n')

        with open('output_end.html') as end:
            out.write(end.read())

    return json.dumps({'result': 'Success'})


@app.route('/generateMarkscheme', methods=['POST'])
def generateMarkscheme():
    data = json.loads(request.data.decode())

    subject = data['subject']
    with open('templates/markscheme.html', 'w') as out:
        with open('output_start.html') as start:
            out.write(start.read())

        for idx, question in enumerate(data['questions']):
            out.write('<h3>Q' + str(idx + 1) + '</h3>\n')
            with open('static/angulartemplates/' + subject + '/' + question + 'a.html') as f:
                out.write(f.read() + '\n')

        with open('output_end.html') as end:
            out.write(end.read())

    return json.dumps({'result': 'Success'})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
