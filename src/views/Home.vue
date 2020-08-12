<template>
  <div class="home">
    <table-component :table="table" :items="items" border>
        <template #header>
          <custom-button @click="table.deleteRows" rounded>DELETE SELECTED</custom-button>
        </template>

        <template #actions="row">
            <confirm title="Delete User" @ok="row._table.delete()">
              <custom-button >Delete User</custom-button>

              <template #content>
                  <div>Are you sure you want to delete the user ?</div>
                    {{ row.name }} - id {{ row.id }}
                </template>
            </confirm>
        </template>

        <template #name="row">
          <prompt-component
           title="Change Name"
           v-model="row.name"
           @ok="row._table.save()" />
        </template>

        <template #username="row">
          <prompt-component
           title="Change Username"
           v-model="row.username"
           @ok="row._table.save()" />
        </template>

        <template #email="row">
          <prompt-component
           title="Change Email"
           v-model="row.email"
           @ok="row._table.save()" />
        </template>
    </table-component>
  </div>
</template>

<script>
import CustomButton from '@/components/CustomButton.vue'
import Table from '@/components/Table/Table'
import TableComponent from '@/components/Table/index.vue'
import Confirm from '@/components/Modal/Confirm.vue'
import PromptComponent from '@/components/Modal/PromptComponent.vue'
import userData from '../userData.json'

const table = new Table({
  columns: [
    { label: '', key: 'button', align: 'center' },
    { label: 'ID', key: 'id', align: 'center', width: '100px' },
    { label: 'Name', key: 'name', align: 'center' },
    { label: 'User Name', key: 'username', align: 'center' },
    { label: 'Email', key: 'email' },
    { label: '', key: 'actions', width: '100px' }
  ],
  selection: true,
  title: 'Table Component'
})

export default {
  name: 'Home',
  components: {
    TableComponent,
    CustomButton,
    PromptComponent,
    Confirm
  },

  data () {
    return {
      table,
      items: userData
    }
  }
}
</script>
