import { Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { AutocompleteItem } from '../../../models/utils';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-app-nz-autocomplete',
  templateUrl: './app-nz-autocomplete.component.html',
  styleUrls: ['./app-nz-autocomplete.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppNzAutocompleteComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  @Output() selected = new EventEmitter<AutocompleteItem>();
  @Input() loading: boolean;
  @Input() placeholder: string;
  @Input() set searchResult(value) {
    console.log(value);

    if (value) {
      if (value.children || value[0] && value[0].childen) {
        this.showSearchResult = value.children;
      } else {
        if (value[0] && value[0].childen) {
          this.showSearchResult = value[0].children;
        } else {
          this.showSearchResult = value;
        }
      }
    }
  }
  showSearchResult: AutocompleteItem[];
  searchControl = new FormControl('');

  constructor() { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(500))
      .subscribe(data => {
        this.search.emit(data);
      });
  }

  optionSelected(event, option: AutocompleteItem): void {
    if (event.isUserInput) {
      this.selected.emit(option);
      this.searchControl.reset();
    }
  }
}
