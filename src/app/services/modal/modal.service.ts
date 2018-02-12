/**
 * Created by juandavidcruzgomez on 15/09/2017.
 */

// From http://jasonwatmore.com/post/2017/01/24/angular-2-custom-modal-window-dialog-box
// Modified to use objects instead of arrays... hashtables FTW

export class ModalService {
  private modals: any = {};

  add(modal: any) {
    if (modal['id']) {
      this.modals['id'] = modal;
    } else {
      console.error(`The given modal has no id. Cannot register it.`);
    }
  }

  remove(id: string) {
    if (this.modals['id']) {
      delete this.modals['id'];
    }
  }

  open(id: string) {
    if (this.modals['id']) {
      this.modals['id'].open();
    } else {
      console.error(`The given modal hasn't been registered. Cannot open it.`);
    }
  }

  close(id: string) {
    if (this.modals['id']) {
      this.modals['id'].close();
    } else {
      console.error(`The given modal hasn't been registered. Cannot close it (??).`);
    }
  }
}
