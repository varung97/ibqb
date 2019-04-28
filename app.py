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


@app.route('/generatePaper', methods=['POST'])
def generatePaper():
    data = json.loads(request.data.decode())

    subject = data['subject']
    with open('templates/blah.html', 'w') as out:
        for question in data['questions']:
            with open('static/angulartemplates/' + subject + '/' + question + 'q.html') as f:
                out.write(f.read() + '\n')
    return render_template('blah.html')
    return send_file('blah.html', attachment_filename='blah.html')


@app.route('/generateMarkscheme', methods=['POST'])
def generateMarkscheme():
    data = json.loads(request.data.decode())

    subject = data['subject']
    with open('blah.html', 'w') as out:
        for question in data['questions']:
            with open('static/angulartemplates/' + subject + '/' + question + 'a.html') as f:
                out.write(f.read() + '\n')

    return send_file('blah.html', attachment_filename='blah.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
