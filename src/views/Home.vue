<template>
  <div class="home">
    <table-component :table="table" :items="items" border loaderColor="#FFB917">
        <template #header>
          <div>
            <custom-button rounded>LOAD SELECTED</custom-button>
            <custom-button @click="table.deleteRows" rounded>DELETE SELECTED</custom-button>
          </div>
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
    </table-component>
  </div>
</template>

<script>
import CustomButton from '@/components/CustomButton.vue'
import Table from '@/components/Table/Table'
import TableComponent from '@/components/Table/index.vue'
import Confirm from '@/components/Modal/Confirm.vue'
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
    Confirm
  },

  data () {
    return {
      table,
      loader: false,
      items: userData
    }
  }
}
</script>
