import os


QPATH = '../questions/'
OUTPATH = 'static/angulartemplates/'


def find_2nd(string, substring):
   return string.find(substring, string.find(substring) + 1)


if __name__ == '__main__':
    for subject in next(os.walk(QPATH))[1]:
        if subject == 'Geography' or subject == 'Psychology' or subject == 'History' or subject == 'BusinessManagement' or subject == 'Economics':
            continue

        print(subject)

        for question in next(os.walk(os.path.join(QPATH, subject)))[2]:
            qid = question.strip('.html')

            with open(os.path.join(QPATH, subject, question)) as f:
                contents = f.read()
                contents = contents.replace('../../../../../../../ib-questionbank-attachments.s3.amazonaws.com/uploads/tinymce_asset/asset', 'static/tinymce_asset')

                i = contents.find('<h2>Question</h2>')
                contents = contents[i:]

                i = find_2nd(contents, '<h2')
                question = contents[:i]
                contents = contents[i:]

                i = find_2nd(contents, '<h2')
                answer = contents[:i]

            with open(os.path.join(OUTPATH, subject, qid + '.html'), 'w') as f:
                f.write(question)
                f.write(answer)

            with open(os.path.join(OUTPATH, subject, qid + 'q.html'), 'w') as f:
                f.write(question[question.find('<div'):])

            with open(os.path.join(OUTPATH, subject, qid + 'a.html'), 'w') as f:
                f.write(answer[answer.find('<div'):])
