<template>
  <div class="home">
    <table-component :table="table" :items="items" border>
        <template #header>
          <confirm title="Create User" @ok="createUser">
            <custom-button rounded class="margin-left-auto">Create</custom-button>
            <template #content>
              <div class="text-left">
               <textfield label="Name" v-model="user.name"/>
               <textfield label="Email" v-model="user.email" />
               <textfield label="User Name" v-model="user.username" />
              </div>
            </template>
          </confirm>

          <custom-button @click="table.deleteRows" rounded class="margin-xs-left">Delete Selected</custom-button>
        </template>

        <template #actions="row">
            <confirm title="Delete User" @ok="row._table.delete()">
              <custom-button>Delete User</custom-button>

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
import Textfield from '@/components/Textfield.vue'
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
    { label: '', key: 'actions', width: '150px' }
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
    Confirm,
    Textfield
  },

  data () {
    return {
      table,
      items: userData,
      user: {
        id: Math.ceil(Math.random() * 100),
        email: '',
        name: '',
        username: ''
      }
    }
  },

  methods: {
    createUser () {
      const { user } = this
      this.items.push(user)
    }
  }
}
</script>
