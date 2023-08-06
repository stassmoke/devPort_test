<template>
  <div class="profile">
    <!-- Sorry, no time to split into components -->

    <div class="profile-data">
        <div class="profile-data__grid">
            <div class="profile-data__cell">
                <div class="profile-data__label">name</div>
                <div class="profile-name profile-data__text">{{ userData.name }}</div>
            </div>
            <div class="profile-data__cell">
                <div class="profile-data__label">username</div>
                <div class="profile-username profile-data__text">{{ userData.username }}</div>
            </div>
            <div class="profile-data__cell">
                <div class="profile-data__label">phone</div>
                <div class="profile-phone profile-data__text">{{ userData.phone }}</div>
            </div>
            <div class="profile-data__cell">
                <div class="profile-data__label">website</div>
                <a class="profile-website profile-data__text" :href="userData.website" target="_blank">{{ userData.website }}</a>
            </div>
        </div>
    </div>
    <div class="profile-todos__wrapper">
        <div class="profile-todos__row">
            <select v-model="selectedStatus">
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="uncompleted">Uncompleted</option>
                <option value="favorites">Favorites</option>
            </select>
            
            <select v-model="selectedUserId">
                <option value="all">All Users</option>
                <option 
                    v-for="user in users" 
                    :key="user.id" 
                    :value="user.id"
                >
                    {{ user.id }}
                </option>
            </select>
            <input v-model="searchText" placeholder="Search by title">
        </div>
        <div class="profile-todos__row profile-todos__row__add">
            <button 
                class="btn" 
                @click="isOpenCreateTodo = !isOpenCreateTodo"
            >
                {{!isOpenCreateTodo ? 'Create new todo' : 'Close' }}
            </button>
            <div v-if="isOpenCreateTodo">
                <input v-model="newTodo.userId" placeholder="User ID">
                <input v-model="newTodo.title" placeholder="Title">
                <button class="btn" @click="addTodo">Add new</button>
            </div>
        </div>
            
        <ul v-if="filteredTodos.length > 0">
            <li 
                v-for="todo in filteredTodos"
                :key="todo.id"
                class="profile-todos__list"
            >
                <span>
                    <span class="profile-todos__list__title">{{ todo.title }}</span>
                    <span class="profile-todos__list__title">completed - {{ todo.completed }}</span>
                </span>
                <button 
                    @click="addToFavorites(todo.id)"
                    :class="[{ 'btn-favorite': favorites[todo.id] }, 'btn']"
                    :disabled="!todo.userId"
                >
                    {{ favorites[todo.id] ? 'Remove from Favorites' : 'Add to Favorites' }}
                </button>
            </li>
        </ul>
        <div v-else class="profile-todos__error">No filtered items</div>
    </div>
    
    <!-- Sorry, no time to split into components -->
  </div>
</template>

<script>

import axios from 'axios'

export default {
    name: 'user-profile',
    data() {
        return {
            userData: {},
            allTodos: [],
            relevantTodos: [],
            selectedStatus: 'all',
            selectedUserId: 'all',
            searchText: '',
            newTodo: {
                userId: '',
                title: '',
                completed: false,
            },
            users: [],
            favorites: {},
            isOpenCreateTodo: false
        }
    },
    computed: {
        profileId() {
            return this.$route.params.id
        },
        filteredTodos() {
            let filteredTodos = this.allTodos

            if (this.selectedStatus !== 'all') {
                if (this.selectedStatus === 'favorites') {
                    const favoriteTodoIds = Object.keys(this.favorites).filter((id) => this.favorites[id]);

                    filteredTodos = filteredTodos.filter((todo) => favoriteTodoIds.includes(todo.id.toString()));
                } else {
                    const status = this.selectedStatus === 'completed' ? true : false;
                    filteredTodos = filteredTodos.filter((todo) => todo.completed === status);
                }
            }
            
            if (this.selectedUserId !== 'all') {
                filteredTodos = filteredTodos.filter(todo => todo.userId === parseInt(this.selectedUserId))
            }
            
            if (this.searchText.trim() !== '') {
                filteredTodos = filteredTodos.filter(todo => todo.title.toLowerCase().includes(this.searchText.toLowerCase()))
            }

            if (this.selectedStatus === 'all') {
                
                filteredTodos = this.allTodos
            }
            
            return filteredTodos
        },
    },
    methods: {
        async getAllUsers() {
            await axios.get('https://jsonplaceholder.typicode.com/users')
            .then(({data: users}) => {
                this.searchRelevant(users)
                this.users = users
            })
            .catch((err) => console.log(err, 'get users err'))
        },
        searchRelevant(users) {
            const foundUser = users.find((user) => user.id === parseInt(this.profileId, 10))

            if (foundUser) {
                this.userData = foundUser
                this.getTodos()
            }
        },
        async getTodos() {
            await axios.get('https://jsonplaceholder.typicode.com/todos')
            .then(({data}) => {
                this.allTodos = data
                this.searchRelevantTodos(data)
            })
            .catch((err) => console.log(err, 'get todos err'))
        },
        searchRelevantTodos(todos) {
            // it's not normal to iterate over arrays like that, it's bad for application performance, but if you want:
            this.relevantTodos = todos.filter((todo) => todo.userId === parseInt(this.profileId, 10))
        },
        async addTodo() {
            await axios.post('https://jsonplaceholder.typicode.com/todos', {
                completed: false,
                title: this.newTodo.title,
            },
            )
            .then(({data}) => {
                this.allTodos = [...this.allTodos, data]
            })
            .catch((err) => console.log(err, 'add new todo err'))
            .finally(() => this.clearNewTodoFields())
        },
        clearNewTodoFields() {
            this.isOpenCreateTodo = false

            this.newTodo = {
                userId: '',
                title: '',
                completed: false,
            }
        },
        toggleFavorite(todoId) {
            // The task does not describe whether it is necessary to save the todo favorite for each user separately
            if (this.favorites[todoId]) {
                this.$delete(this.favorites, todoId)
            } else {
                this.$set(this.favorites, todoId, true)
            }
            localStorage.setItem('favorites', JSON.stringify(this.favorites))
        },
        loadFavoritesFromLocalStorage() {
            const storedFavorites = localStorage.getItem('favorites')
            if (storedFavorites) {
                this.favorites = JSON.parse(storedFavorites)
            }
        },
        addToFavorites(todoId) {
            // The task does not describe whether it is necessary to save the todo favorite for each user separately
            this.toggleFavorite(todoId)
        },
    },
    mounted() {
        this.getAllUsers()
        this.loadFavoritesFromLocalStorage()
    }
}
</script>

<style lang="sass">
@import '@/assets/styles/_variables.sass'

.profile
    padding: 5rem 0

    &-data
        margin-bottom: 5rem
        border-bottom: 1px solid $lightGrey
        padding-bottom: 5rem

        &__grid
            display: grid
            grid-template-columns: repeat(2, 20%)
            grid-template-rows: repeat(2, 1fr)
            grid-column-gap: 2rem
            grid-row-gap: 2rem

        &__label
            font-size: 1.6rem
            font-weight: 500
            color: white
            text-transform: capitalize
            margin-bottom: .5rem

        &__text
            font-size: 1.5rem
            color: $textWhite

    &-todos
        &__row
            display: flex
            align-items: center
            margin-bottom: 3rem

            input,
            select
                margin-right: 2rem  

        &__list
            padding: 1rem 0
            border-bottom: 1px solid $lightGrey
            display: flex
            align-items: center
            justify-content: space-between


            &__title
                font-size: 1.6rem
                margin-right: 2rem

        &__row__add
            .btn
                margin-right: 2rem  

        &__error
            font-size: 2rem
</style>