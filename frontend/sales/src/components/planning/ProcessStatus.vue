<template>
  <div>
    <NewAccordion>
      <AccordionTab :key="process._rev" :disabled="status.disabled" :active.sync="active">
        <template slot="header">
          <span class="margin-right">{{ process.label + ' - Lv: ' + process.level }}</span>
          <span v-if="style" class="margin-right" :style="style" />
          <Button :label="status.label" :icon="status.icon" :class="status.class" @click="onClick" :disabled="status.disabled" />
        </template>
        <ProcessForm ref="pf" :_process="process" />
      </AccordionTab>
    </NewAccordion>
    <ContextMenu :model="menuModel" ref="cm" />
  </div>
</template>

<script>
import ProcessForm from './ProcessForm'
export default {
  name: 'ProcessStatus',
  props: ['_id'],
  components: { ProcessForm },
  data() {
    return { menuModel: null, active: false }
  },
  methods: {
    onClick(e) {
      if (this.process.status === 'Need to start') {
        this.menuModel = [{ label: 'Start', icon: 'pi pi-reply', command: () => this.start() }]
        this.$refs.cm.show(e)
      }
    },
    start() {
      this.$refs.pf.save('Started')
    },
  },
  computed: {
    process() {
      return this.$store.getters['operation/process/getBy_id'](this._id)
    },
    status() {
      return this.$store.getters['operation/process/status'](this.process)
    },
    style() {
      return this.process.color ? 'padding: 12px 20px; border-radius: 3px; background-color: ' + this.process.color.value : ''
    },
  },
}
</script>
