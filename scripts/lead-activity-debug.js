#!/usr/bin/env node
/*
  Lead activity debug utility (safe by default)
  Usage examples:
    node scripts/lead-activity-debug.js --list
    node scripts/lead-activity-debug.js --lead <leadIdOrSlug> --list
    node scripts/lead-activity-debug.js --lead <leadIdOrSlug> --follow-at "2025-08-13T12:00" --write

  Notes:
  - By default this script is READ-ONLY. Use --write to persist a follow-up reminder.
  - It prints current schema columns for sanity, and recent LeadActivity rows.
*/

const { PrismaClient } = require('@prisma/client');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--list') args.list = true;
    else if (a === '--write') args.write = true;
    else if (a === '--lead') { args.lead = argv[++i]; }
    else if (a === '--follow-at') { args.followAt = argv[++i]; }
    else if (a === '--help') args.help = true;
  }
  return args;
}

function help() {
  console.log(`Lead activity debug
Options:
  --list                List columns and recent activity (default safe op)
  --lead <idOrSlug>     Filter activity to a specific lead by id or slug
  --follow-at <ISO>     Schedule a follow-up reminder at ISO datetime (requires --write)
  --write               Actually write the follow-up reminder (otherwise dry-run)
`);
}

(async () => {
  const args = parseArgs(process.argv);
  if (args.help) { help(); process.exit(0); }

  const prisma = new PrismaClient();

  // Columns sanity
  const leadCols = await prisma.$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_name='Lead' ORDER BY ordinal_position");
  const actCols = await prisma.$queryRawUnsafe("SELECT column_name FROM information_schema.columns WHERE table_name='LeadActivity' ORDER BY ordinal_position");
  console.log('Lead columns:', leadCols.map(r => r.column_name));
  console.log('LeadActivity columns:', actCols.map(r => r.column_name));

  // Resolve lead (optional)
  let lead = null;
  if (args.lead) {
    lead = await prisma.lead.findFirst({ where: { OR: [{ id: args.lead }, { slug: args.lead }] }, select: { id: true, slug: true, agentId: true, metadata: true } });
    if (!lead) {
      console.error('Lead not found for', args.lead);
      process.exit(1);
    }
    console.log('Resolved lead:', lead.id, 'slug=', lead.slug);
  }

  // List recent activity (global or by lead)
  if (args.list || (!args.followAt && !args.write)) {
    const where = lead ? { leadId: lead.id } : {};
    const recent = await prisma.leadActivity.findMany({ where, orderBy: { createdAt: 'desc' }, take: 10 });
    console.log('Recent LeadActivity:', recent);
  }

  // Optionally schedule a follow-up (requires --lead and --follow-at and --write)
  if (args.followAt) {
    if (!lead) {
      console.error('Please pass --lead <idOrSlug> when using --follow-at');
      process.exit(1);
    }
    const at = new Date(args.followAt);
    if (isNaN(at.getTime())) {
      console.error('Invalid --follow-at datetime');
      process.exit(1);
    }
    const iso = at.toISOString();
    console.log('[Dry-run]', args.write ? 'write' : 'no-write', 'Scheduling follow-up at', iso);
    if (args.write) {
      // Persist to Lead.metadata.reminders (append-only)
      let meta = {};
      try { meta = lead.metadata ? JSON.parse(lead.metadata) : {}; } catch {}
      const reminders = Array.isArray(meta.reminders) ? meta.reminders : [];
      reminders.push({ type: 'follow-up', at: iso });
      await prisma.lead.update({ where: { id: lead.id }, data: { metadata: JSON.stringify({ ...meta, reminders }) } });
      // Log in LeadActivity
      await prisma.leadActivity.create({ data: { leadId: lead.id, type: 'followup-scheduled', data: { at: iso } } });
      console.log('Follow-up persisted.');
      const verify = await prisma.leadActivity.findMany({ where: { leadId: lead.id, type: 'followup-scheduled' }, orderBy: { createdAt: 'desc' }, take: 1 });
      console.log('Latest followup-scheduled:', verify[0]);
    }
  }

  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });


