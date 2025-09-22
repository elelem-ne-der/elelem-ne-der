/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const supabase = require('../lib/supabase');

async function upsertGrade(name) {
  const { data, error } = await supabase
    .from('grade_levels')
    .upsert({ name }, { onConflict: 'name' })
    .select()
    .single();
  if (error) throw error;
  return data.id;
}

async function upsertSubject(gradeId, name, slug) {
  const { data, error } = await supabase
    .from('subjects')
    .upsert({ grade_level_id: gradeId, name, slug }, { onConflict: 'grade_level_id,slug' })
    .select()
    .single();
  if (error) throw error;
  return data.id;
}

async function upsertUnit(subjectId, name, index) {
  const { data, error } = await supabase
    .from('units')
    .upsert({ subject_id: subjectId, name, order_index: index }, { onConflict: 'subject_id,name' })
    .select()
    .single();
  if (error) throw error;
  return data.id;
}

async function upsertTopic(unitId, name, index) {
  const { error } = await supabase
    .from('topics')
    .upsert({ unit_id: unitId, name, order_index: index }, { onConflict: 'unit_id,name' });
  if (error) throw error;
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const file = path.resolve(__dirname, '../../docs/curriculum/grade-9.json');
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));

  const gradeId = await upsertGrade(`${json.grade}. Sınıf`);
  for (const subject of json.subjects) {
    const subjectId = await upsertSubject(gradeId, subject.name, subject.slug || slugify(subject.name));
    for (let i = 0; i < subject.units.length; i += 1) {
      const unit = subject.units[i];
      const unitId = await upsertUnit(subjectId, unit.name, i);
      for (let j = 0; j < (unit.topics || []).length; j += 1) {
        await upsertTopic(unitId, unit.topics[j], j);
      }
    }
  }
  console.log('Müfredat import tamamlandı.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


