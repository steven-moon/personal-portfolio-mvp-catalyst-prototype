

#Creating a new cursor rule

create new cursor rule for the {file-name}.mdc using the command below as a example.  The cursor rules are now stored in .cursor/rules/file-name.mdc but because of bugs you need to use a command similar to the one below to work.

use the {file-name} of (add your )


echo "# Description: Guidelines for maintaining Cursor rules" > .cursor/rules/rule_maintenance.mdc && echo "# Globs: .cursor/rules/**/*.mdc" >> .cursor/rules/rule_maintenance.mdc && echo "" >> .cursor/rules/rule_maintenance.mdc && echo "## Rule Maintenance Guidelines" >> .cursor/rules/rule_maintenance.mdc && echo "- Keep Cursor rules up to date with project changes" >> .cursor/rules/rule_maintenance.mdc && echo "- Review and update rules periodically" >> .cursor/rules/rule_maintenance.mdc && echo "- Update rules when adding new technologies or patterns" >> .cursor/




