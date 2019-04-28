import os
import re
import json
from bs4 import BeautifulSoup
from collections import defaultdict


QPATH = 'static/questions/'


if __name__ == '__main__':
    questions = {}

    for subject in next(os.walk(QPATH))[1]:
        if subject == 'Geography' or subject == 'Psychology' or subject == 'History' or subject == 'BusinessManagement' or subject == 'Economics':
            continue

        print(subject)
        questions[subject] = {'questions': [], 'years': set(), 'papers': set(), 'levels': set(), 'tzs': set(), 'sessions': set(), 'outer_sections': set(), 'sections': defaultdict(set)}

        for question in next(os.walk(os.path.join(QPATH, subject)))[2]:
            qid = question.strip('.html')

            with open(os.path.join(QPATH, subject, question)) as f:
                contents = f.read()
                i = contents.find('Reference code')
                yearsession, paper, level, tz, _ = contents[i : i + 100].split('info_value\'>')[1].split('</td>')[0].split('.')
                year, session = '20' + yearsession[:2], yearsession[2:]
                level = level.upper()
                tz = tz[-1]

                i = contents.find('<h2>Syllabus sections</h2>')
                if i == -1:
                    continue
                sections = BeautifulSoup(contents[i : i + 400].split('<div>')[1].split('</div>')[0], 'html5lib').getText().split('\u00BB')
                outer_section = sections[0].strip()
                inner_section = sections[1].strip() if len(sections) > 1 else 'N/A'

                if 'SP' in yearsession:
                    continue

                if 'O' in tz:
                    tz = '0'

                questions[subject]['years'].add(year)
                questions[subject]['papers'].add(paper)
                questions[subject]['levels'].add(level)
                questions[subject]['tzs'].add(tz)
                questions[subject]['sessions'].add(session)
                questions[subject]['outer_sections'].add(outer_section)
                questions[subject]['sections'][outer_section].add(inner_section)
                questions[subject]['questions'].append({
                    'id': qid,
                    'year': year,
                    'session': session,
                    'paper': paper,
                    'level': level,
                    'tz': tz,
                    'outer_section': outer_section,
                    'inner_section': inner_section
                })
            # break

        print(questions[subject]['sections'])

    with open('static/json/questions.json', 'w') as f:
        for subject in questions:
            questions[subject]['years'] = list(sorted(questions[subject]['years']))
            questions[subject]['papers'] = list(sorted(questions[subject]['papers']))
            questions[subject]['levels'] = list(sorted(questions[subject]['levels']))
            questions[subject]['tzs'] = list(sorted(questions[subject]['tzs']))
            questions[subject]['sessions'] = list(sorted(questions[subject]['sessions']))
            questions[subject]['outer_sections'] = list(sorted(questions[subject]['outer_sections']))
            questions[subject]['sections'] = dict({k: sorted(v) for k, v in questions[subject]['sections'].items()})

        f.write(json.dumps(questions))
