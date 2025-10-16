<script setup lang="ts">
definePageMeta({
  middleware: ["protected"],
  layout: "dashboard",
});

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
};
type CreateProduct = Omit<Product, "id"> & { id?: number };

const useProduct = useProductStore();
const products = ref<Product[]>();
const formModel = ref<CreateProduct>({ name: "", price: "", categoryId: 0 });
const dialog = shallowRef(false);
const isEditing = toRef(() => !!formModel.value.id);

onMounted(async () => {
  const res = await useProduct.getAll();
  if (res) {
    products.value = res;
  }
});

const headers = [
  { title: "ID", key: "id", align: "start" },
  { title: "Name", key: "name" },
  { title: "Description", key: "description" },
  { title: "Price", key: "price" },
  { title: "Category ID", key: "categoryId" },
  { title: "Create At", key: "createdAt" },
  { title: "Update At", key: "updatedAt" },
  { key: "actions" },
];

function add() {
  formModel.value = { name: "", price: "", categoryId: 0 };
  dialog.value = true;
}

function edit(id: number) {
  const found = products.value?.find((cat) => cat.id === id);
  if (!found) return;
  formModel.value = {
    id: found.id,
    name: found.name,
    price: found.price,
    categoryId: found.categoryId,
    description: found.description,
  };
  dialog.value = true;
}

async function remove(id: number) {
  const res = await useProduct.delete(id);
  if (res) {
    const index = products.value?.findIndex((book) => book.id === id);
    if (index) products.value?.splice(index, 1);
  }
}

async function save() {
  if (isEditing.value) {
    await saveEdit();
  } else {
    const res = await useProduct.create(
      formModel.value.name,
      formModel.value.price,
      formModel.value.categoryId,
      formModel.value.description,
    );
    if (res) {
      formModel.value.id = res.id;
      formModel.value.createdAt = res.createdAt;
      formModel.value.updatedAt = res.updatedAt;
      products.value?.push(formModel.value as Product);
    }
  }

  dialog.value = false;
}

async function saveEdit() {
  if (!formModel.value.id) return;
  const res = await useProduct.update(
    formModel.value.id,
    formModel.value.name,
    formModel.value.price,
    formModel.value.categoryId,
    formModel.value.description,
  );
  if (res) {
    const index = products.value?.findIndex(
      (cat) => cat.id === formModel.value.id,
    );
    if (index && products.value)
      products.value[index] = formModel.value as Product;
  }
}
</script>

<template>
  <v-sheet border rounded>
    <v-data-table
      :headers="headers"
      :hide-default-footer="true"
      :items="products"
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
            Products
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Add a Product"
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
    <v-card :title="`${isEditing ? 'Edit' : 'Add'} a Product`">
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
              v-model="formModel.categoryId"
              label="Category ID"
            ></v-number-input>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.price"
              label="Price"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.description"
              label="Description"
            ></v-text-field>
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
