<script setup lang="ts">
definePageMeta({
  middleware: ["protected"],
  layout: "dashboard",
});

type Category = {
  id: number;
  name: string;
  parentId?: number;
  productsCount?: number;
  createdAt?: string;
  updatedAt?: string;
};
type CreateCategory = Omit<Category, "id"> & { id?: number };

const useCat = useCategoryStore();
const categories = ref<Category[]>();
const formModel = ref<CreateCategory>({ name: "" });
const dialog = shallowRef(false);
const isEditing = toRef(() => !!formModel.value.id);

onMounted(async () => {
  const res = await useCat.getAll();
  if (res) {
    categories.value = res;
  }
});

const headers = [
  { title: "ID", key: "id", align: "start" },
  { title: "Name", key: "name" },
  { title: "Parent ID", key: "parentId" },
  { title: "Products Count", key: "productsCount" },
  { title: "Create At", key: "createdAt" },
  { title: "Update At", key: "updatedAt" },
  { key: "actions" },
];

function add() {
  formModel.value = { name: "" };
  dialog.value = true;
}

function edit(id: number) {
  const found = categories.value?.find((cat) => cat.id === id);
  if (!found) return;
  formModel.value = {
    id: found.id,
    name: found.name,
    parentId: found.parentId,
  };
  dialog.value = true;
}

async function remove(id: number) {
  const res = await useCat.delete(id);
  if (res) {
    const index = categories.value?.findIndex((book) => book.id === id);
    if (index) categories.value?.splice(index, 1);
  }
}

async function save() {
  if (isEditing.value) {
    await saveEdit();
  } else {
    const res = await useCat.create(
      formModel.value.name,
      formModel.value.parentId,
    );
    if (res) {
      formModel.value.id = res.id;
      formModel.value.productsCount = res.productsCount || 0;
      formModel.value.createdAt = res.createdAt;
      formModel.value.updatedAt = res.updatedAt;
      categories.value?.push(formModel.value as Category);
    }
  }

  dialog.value = false;
}

async function saveEdit() {
  if (!formModel.value.id) return;
  const res = await useCat.update(
    formModel.value.id,
    formModel.value.name,
    formModel.value.parentId,
  );
  if (res) {
    const index = categories.value?.findIndex(
      (cat) => cat.id === formModel.value.id,
    );
    if (index && categories.value)
      categories.value[index] = formModel.value as Category;
  }
}
</script>

<template>
  <v-sheet border rounded>
    <v-data-table
      :headers="headers"
      :hide-default-footer="true"
      :items="categories"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-book-multiple"
              size="x-small"
              start
            ></v-icon>
            Categories
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Add a Category"
            border
            @click="add"
          ></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.title="{ value }">
        <v-chip
          :text="value"
          border="thin opacity-25"
          prepend-icon="mdi-book"
          label
        >
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon
            color="medium-emphasis"
            icon="mdi-pencil"
            size="small"
            @click="edit(item.id)"
          ></v-icon>

          <v-icon
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="remove(item.id)"
          ></v-icon>
        </div>
      </template>
    </v-data-table>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card :title="`${isEditing ? 'Edit' : 'Add'} a Category`">
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="formModel.name"
              label="Name"
              requerd
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-number-input
              v-model="formModel.parentId"
              label="Parent ID"
            ></v-number-input>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Save" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
